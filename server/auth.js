import { randomBytes, scryptSync, timingSafeEqual, createHmac } from 'node:crypto'
import { get, run } from './db.js'

function secret() {
  if (process.env.PEACEQUEST_SECRET) return process.env.PEACEQUEST_SECRET
  const row = get(`SELECT value FROM meta WHERE key = 'secret'`)
  if (row) return row.value
  const s = randomBytes(32).toString('hex')
  run(`INSERT INTO meta (key, value) VALUES ('secret', ?)`, s)
  return s
}
const SECRET = secret()

export function hashPassword(pw) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(pw, salt, 32).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(pw, stored) {
  const [salt, hash] = String(stored).split(':')
  if (!salt || !hash) return false
  const test = scryptSync(pw, salt, 32)
  const real = Buffer.from(hash, 'hex')
  return real.length === test.length && timingSafeEqual(real, test)
}

const b64 = s => Buffer.from(s).toString('base64url')
const sign = body => createHmac('sha256', SECRET).update(body).digest('base64url')

export function issueToken(user) {
  const body = b64(JSON.stringify({ uid: user.id, role: user.role, exp: Date.now() + 1000 * 60 * 60 * 24 * 14 }))
  return `${body}.${sign(body)}`
}

export function readToken(token) {
  if (!token || !token.includes('.')) return null
  const [body, sig] = token.split('.')
  const expected = sign(body)
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}

export function requireAuth(req, res, next) {
  const h = req.headers.authorization || ''
  const data = readToken(h.startsWith('Bearer ') ? h.slice(7) : null)
  if (!data) return res.status(401).json({ error: 'Please log in.' })
  const user = get(`SELECT id, role, username, name, class_id, avatar, xp FROM users WHERE id = ?`, data.uid)
  if (!user) return res.status(401).json({ error: 'Account not found.' })
  req.user = user
  next()
}

export const requireRole = role => (req, res, next) => {
  if (req.user?.role !== role) return res.status(403).json({ error: role === 'teacher' ? 'Only teachers can see this area.' : 'This area is for students.' })
  next()
}
