import express from 'express'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomInt } from 'node:crypto'
import { all, get, run, tx } from './db.js'
import { hashPassword, verifyPassword, issueToken, requireAuth, requireRole } from './auth.js'
import { buildProgress, computeStats, awardBadges, findActivity, customFor } from './progress.js'
import { BY_ID, ALL_CONTENT, summary, SCENES } from '../shared/catalog.js'
import { scoreActivity } from '../shared/scoring.js'
import { levelInfo, todayStr, SKILLS, REGIONS } from '../shared/progression.js'
import { CAST, AVATAR_OPTIONS, DEFAULT_AVATAR } from '../shared/cast.js'

const app = express()
app.use(express.json({ limit: '200kb' }))

const MOODS = ['happy', 'calm', 'excited', 'tired', 'worried', 'sad', 'angry', 'scared', 'frustrated', 'lonely']
const bad = (res, msg, code = 400) => res.status(code).json({ error: msg })
const clean = (s, max = 500) => String(s ?? '').trim().slice(0, max)

function publicUser(u) {
  const cls = u.class_id ? get(`SELECT id, name, code FROM classes WHERE id = ?`, u.class_id) : null
  return {
    id: u.id,
    role: u.role,
    username: u.username,
    name: u.name,
    avatar: u.avatar ? JSON.parse(u.avatar) : DEFAULT_AVATAR,
    xp: u.xp,
    class: cls ? { id: cls.id, name: cls.name, ...(u.role === 'teacher' ? { code: cls.code } : {}) } : null,
  }
}

function validAvatar(a) {
  if (!a || typeof a !== 'object') return DEFAULT_AVATAR
  const pick = (k, v) => (AVATAR_OPTIONS[k].includes(v) ? v : DEFAULT_AVATAR[k])
  return { skin: pick('skin', a.skin), hair: pick('hair', a.hair), hairColor: pick('hairColor', a.hairColor), shirt: pick('shirt', a.shirt), extra: pick('extra', a.extra) }
}

function classCode() {
  const words = ['SUN', 'OAK', 'SKY', 'RIVER', 'LEAF', 'STAR', 'MOON', 'HILL', 'BIRD', 'WAVE']
  for (;;) {
    const code = `${words[randomInt(words.length)]}-${randomInt(10, 99)}`
    if (!get(`SELECT 1 FROM classes WHERE code = ?`, code)) return code
  }
}

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.post('/api/auth/login', (req, res) => {
  const username = clean(req.body?.username, 80).toLowerCase()
  const password = String(req.body?.password ?? '')
  const user = get(`SELECT * FROM users WHERE username = ?`, username)
  if (!user || !verifyPassword(password, user.password_hash)) return bad(res, 'That username and password don’t match. Try again!', 401)
  run(`UPDATE users SET last_active = datetime('now') WHERE id = ?`, user.id)
  res.json({ token: issueToken(user), user: publicUser(user) })
})

app.post('/api/auth/register-student', (req, res) => {
  const name = clean(req.body?.name, 40)
  const username = clean(req.body?.username, 30).toLowerCase()
  const password = String(req.body?.password ?? '')
  const code = clean(req.body?.classCode, 20).toUpperCase()
  if (name.length < 2) return bad(res, 'Please tell us your first name.')
  if (!/^[a-z0-9_.]{3,30}$/.test(username)) return bad(res, 'Usernames use 3–30 letters, numbers, dots or underscores.')
  if (password.length < 6) return bad(res, 'Passwords need at least 6 characters.')
  const cls = get(`SELECT * FROM classes WHERE code = ?`, code)
  if (!cls) return bad(res, 'We couldn’t find that class code. Ask your teacher to check it.')
  if (get(`SELECT 1 FROM users WHERE username = ?`, username)) return bad(res, 'That username is taken. Try adding a number!')
  const avatar = validAvatar(req.body?.avatar)
  const r = run(`INSERT INTO users (role, username, name, password_hash, class_id, avatar, last_active) VALUES ('student', ?, ?, ?, ?, ?, datetime('now'))`, username, name, hashPassword(password), cls.id, JSON.stringify(avatar))
  const user = get(`SELECT * FROM users WHERE id = ?`, r.lastInsertRowid)
  res.json({ token: issueToken(user), user: publicUser(user) })
})

app.post('/api/auth/register-teacher', (req, res) => {
  const name = clean(req.body?.name, 60)
  const username = clean(req.body?.email, 80).toLowerCase()
  const password = String(req.body?.password ?? '')
  const className = clean(req.body?.className, 60) || `${name}’s class`
  if (name.length < 2) return bad(res, 'Please enter your name.')
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(username)) return bad(res, 'Please enter a valid email address.')
  if (password.length < 8) return bad(res, 'Teacher passwords need at least 8 characters.')
  if (get(`SELECT 1 FROM users WHERE username = ?`, username)) return bad(res, 'An account with that email already exists.')
  const user = tx(() => {
    const c = run(`INSERT INTO classes (name, code) VALUES (?, ?)`, className, classCode())
    const u = run(`INSERT INTO users (role, username, name, password_hash, class_id, last_active) VALUES ('teacher', ?, ?, ?, ?, datetime('now'))`, username, name, hashPassword(password), c.lastInsertRowid)
    run(`UPDATE classes SET teacher_id = ? WHERE id = ?`, u.lastInsertRowid, c.lastInsertRowid)
    return get(`SELECT * FROM users WHERE id = ?`, u.lastInsertRowid)
  })
  res.json({ token: issueToken(user), user: publicUser(user) })
})

app.get('/api/me', requireAuth, (req, res) => {
  run(`UPDATE users SET last_active = datetime('now') WHERE id = ?`, req.user.id)
  res.json({ user: publicUser(req.user) })
})

app.get('/api/catalog', requireAuth, (req, res) => {
  res.json({ activities: ALL_CONTENT.map(summary), cast: CAST, scenes: SCENES, skills: SKILLS, regions: REGIONS })
})

const student = [requireAuth, requireRole('student')]
const teacher = [requireAuth, requireRole('teacher')]

app.put('/api/me/avatar', student, (req, res) => {
  const avatar = validAvatar(req.body?.avatar)
  run(`UPDATE users SET avatar = ? WHERE id = ?`, JSON.stringify(avatar), req.user.id)
  res.json({ avatar })
})

app.get('/api/progress', student, (req, res) => {
  res.json(buildProgress(req.user.id))
})

app.get('/api/activity/:id', student, (req, res) => {
  const a = findActivity(req.params.id, req.user.class_id)
  if (!a) return bad(res, 'Mission not found.', 404)
  const p = buildProgress(req.user.id)
  if (!p.unlocked[a.id]) return bad(res, 'This mission is still locked. Keep exploring to unlock it!', 403)
  res.json({ activity: a, history: p.per[a.id] || null })
})

app.post('/api/play/complete', student, (req, res) => {
  const id = clean(req.body?.activityId, 80)
  const payload = req.body?.payload || {}
  const activity = findActivity(id, req.user.class_id)
  if (!activity) return bad(res, 'Mission not found.', 404)
  const before = buildProgress(req.user.id)
  if (!before.unlocked[activity.id]) return bad(res, 'This mission is still locked.', 403)
  const result = scoreActivity(activity, payload)
  if (!result.valid) return bad(res, result.error || 'Something didn’t add up.')
  const day = todayStr()
  const prior = before.per[activity.id]
  let breakdown = result.breakdown
  let note = null
  if (activity.kind === 'calm') {
    const todayCalm = get(`SELECT COUNT(*) n FROM completions WHERE user_id = ? AND mode = 'calm' AND day = ? AND xp > 0`, req.user.id, day).n
    if (todayCalm >= 4) { breakdown = [{ label: activity.title, xp: 0 }]; note = 'You’ve earned all the Calm Cove XP for today. Calm is always free to use!' }
  } else if (prior) {
    const reflectXp = result.reflected ? 15 : 0
    if (activity.kind === 'story' && result.ending && !prior.endings.includes(result.ending)) {
      breakdown = [{ label: 'New ending discovered', xp: 35 }, ...(reflectXp ? [{ label: 'Reflection', xp: reflectXp }] : [])]
    } else {
      const full = result.breakdown.reduce((s, b) => s + b.xp, 0) - reflectXp
      breakdown = [{ label: 'Practice replay', xp: Math.max(5, Math.round(full * 0.2)) }, ...(reflectXp ? [{ label: 'Reflection', xp: reflectXp }] : [])]
    }
  }
  const xp = breakdown.reduce((s, b) => s + b.xp, 0)
  const reflection = payload.reflection
  const out = tx(() => {
    run(
      `INSERT INTO completions (user_id, activity_id, mode, ending, tone, score, xp, detail, reflected, rewinds, day) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      req.user.id, activity.id, activity.mode, result.ending || null, result.tone || null, result.score ?? null, xp,
      JSON.stringify({ ...result.stats, steps: result.steps || undefined, choice: payload.choice ?? undefined }),
      result.reflected ? 1 : 0, result.rewinds || 0, day,
    )
    if (result.reflected) {
      run(`INSERT INTO journal (user_id, activity_id, prompt, chip, text) VALUES (?, ?, ?, ?, ?)`, req.user.id, activity.id, clean(reflection.prompt, 300), clean(reflection.chip, 120) || null, clean(reflection.text, 2000) || null)
    }
    run(`UPDATE users SET xp = xp + ?, last_active = datetime('now') WHERE id = ?`, xp, req.user.id)
    return awardBadges(req.user.id)
  })
  const after = buildProgress(req.user.id)
  res.json({
    xp,
    breakdown,
    note,
    firstTime: !prior,
    newBadges: out,
    levelUp: after.level.level > before.level.level ? after.level : null,
    progress: after,
  })
})

app.post('/api/calm/checkin', student, (req, res) => {
  const mood = clean(req.body?.mood, 20)
  const intensity = Math.max(1, Math.min(5, Number(req.body?.intensity) || 3))
  if (!MOODS.includes(mood)) return bad(res, 'Pick a feeling.')
  run(`INSERT INTO checkins (user_id, mood, intensity, note, shared, day) VALUES (?, ?, ?, ?, ?, ?)`, req.user.id, mood, intensity, clean(req.body?.note, 500) || null, req.body?.shared ? 1 : 0, todayStr())
  const fresh = awardBadges(req.user.id)
  res.json({ ok: true, newBadges: fresh })
})

app.get('/api/checkins', student, (req, res) => {
  res.json({ checkins: all(`SELECT id, mood, intensity, note, shared, created_at FROM checkins WHERE user_id = ? ORDER BY id DESC LIMIT 30`, req.user.id) })
})

app.get('/api/journal', student, (req, res) => {
  const rows = all(`SELECT id, activity_id, prompt, chip, text, created_at FROM journal WHERE user_id = ? ORDER BY id DESC`, req.user.id)
  const customs = customFor(req.user.class_id)
  res.json({ entries: rows.map(r => ({ ...r, title: BY_ID[r.activity_id]?.title || customs.find(c => c.id === r.activity_id)?.title || 'Reflection' })) })
})

app.delete('/api/journal/:id', student, (req, res) => {
  run(`DELETE FROM journal WHERE id = ? AND user_id = ?`, Number(req.params.id), req.user.id)
  res.json({ ok: true })
})

app.post('/api/daily/claim', student, (req, res) => {
  const day = todayStr()
  const p = buildProgress(req.user.id)
  const ch = p.daily.find(d => d.id === req.body?.challengeId)
  if (!ch) return bad(res, 'That challenge isn’t available today.')
  if (!ch.done) return bad(res, 'Finish the challenge first!')
  if (ch.claimed) return bad(res, 'Already claimed. Nice work!')
  tx(() => {
    run(`INSERT INTO daily_claims (user_id, day, challenge_id, xp) VALUES (?, ?, ?, ?)`, req.user.id, day, ch.id, ch.xp)
    run(`UPDATE users SET xp = xp + ? WHERE id = ?`, ch.xp, req.user.id)
  })
  const after = buildProgress(req.user.id)
  res.json({ xp: ch.xp, levelUp: after.level.level > p.level.level ? after.level : null, progress: after })
})

function teacherClass(req) {
  return get(`SELECT * FROM classes WHERE id = ?`, req.user.class_id)
}

function studentSummary(s, customs) {
  const { per, stats, skillXp } = computeStats(s.id, customs)
  const lvl = levelInfo(s.xp)
  return {
    id: s.id,
    name: s.name,
    username: s.username,
    avatar: s.avatar ? JSON.parse(s.avatar) : DEFAULT_AVATAR,
    xp: s.xp,
    level: lvl.level,
    levelTitle: lvl.title,
    lastActive: s.last_active,
    missions: stats.completedUnique,
    byMode: stats.byMode,
    skillXp,
    badges: get(`SELECT COUNT(*) n FROM badges WHERE user_id = ?`, s.id).n,
    reflections: stats.reflections,
    plays: Object.values(per).reduce((a, p) => a + p.plays, 0),
  }
}

app.get('/api/teacher/overview', teacher, (req, res) => {
  const cls = teacherClass(req)
  const customs = customFor(cls.id)
  const students = all(`SELECT * FROM users WHERE role = 'student' AND class_id = ? ORDER BY name`, cls.id).map(s => studentSummary(s, customs))
  const ids = students.map(s => s.id)
  const comps = ids.length ? all(`SELECT activity_id, mode, tone, score, detail, user_id, created_at, day FROM completions WHERE user_id IN (${ids.map(() => '?').join(',')})`, ...ids) : []
  const skillTotals = Object.fromEntries(Object.keys(SKILLS).map(k => [k, 0]))
  for (const s of students) for (const k of Object.keys(skillTotals)) skillTotals[k] += s.skillXp[k] || 0
  const byActivity = {}
  for (const c of comps) {
    const a = (byActivity[c.activity_id] ||= { plays: 0, players: new Set(), tones: { bright: 0, mixed: 0, stormy: 0 }, choices: {} })
    a.plays++
    a.players.add(c.user_id)
    if (c.tone) a.tones[c.tone]++
    const d = c.detail ? JSON.parse(c.detail) : {}
    if (d.steps && d.steps[0]) {
      const k = d.steps[0].choice
      a.choices[k] = (a.choices[k] || 0) + 1
    }
  }
  const activityStats = Object.entries(byActivity).map(([id, a]) => {
    const meta = BY_ID[id] || customs.find(c => c.id === id)
    let firstChoices = null
    if (meta?.kind === 'story') {
      const first = meta.nodes[meta.start]
      firstChoices = first.choices.map(ch => ({ id: ch.id, text: ch.t, q: ch.q, count: a.choices[ch.id] || 0 }))
    }
    return { id, title: meta?.title || id, mode: meta?.mode || 'conflict', plays: a.plays, players: a.players.size, tones: a.tones, firstChoices }
  }).sort((x, y) => y.plays - x.plays)
  const week = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const day = todayStr(d)
    week.push({ day, count: comps.filter(c => c.day === day).length })
  }
  const sharedCheckins = ids.length
    ? all(`SELECT c.id, c.mood, c.intensity, c.note, c.created_at, u.name, u.id user_id FROM checkins c JOIN users u ON u.id = c.user_id WHERE c.shared = 1 AND u.class_id = ? ORDER BY c.id DESC LIMIT 12`, cls.id)
    : []
  const modeTotals = {}
  for (const c of comps) modeTotals[c.mode] = (modeTotals[c.mode] || 0) + 1
  res.json({
    class: { id: cls.id, name: cls.name, code: cls.code },
    students,
    totals: {
      students: students.length,
      plays: comps.length,
      activeThisWeek: students.filter(s => s.lastActive && Date.now() - new Date(s.lastActive + 'Z').getTime() < 7 * 86400000).length,
      avgLevel: students.length ? +(students.reduce((a, s) => a + s.level, 0) / students.length).toFixed(1) : 0,
      reflections: students.reduce((a, s) => a + s.reflections, 0),
    },
    skillTotals,
    modeTotals,
    activityStats,
    week,
    sharedCheckins,
  })
})

app.get('/api/teacher/students/:id', teacher, (req, res) => {
  const s = get(`SELECT * FROM users WHERE id = ? AND role = 'student' AND class_id = ?`, Number(req.params.id), req.user.class_id)
  if (!s) return bad(res, 'Student not found in your class.', 404)
  const customs = customFor(req.user.class_id)
  const sum = studentSummary(s, customs)
  const history = all(`SELECT activity_id, mode, tone, score, xp, created_at FROM completions WHERE user_id = ? ORDER BY id DESC LIMIT 40`, s.id)
    .map(c => ({ ...c, title: BY_ID[c.activity_id]?.title || customs.find(x => x.id === c.activity_id)?.title || c.activity_id }))
  const badges = all(`SELECT badge_id, earned_at FROM badges WHERE user_id = ?`, s.id)
  const shared = all(`SELECT mood, intensity, note, created_at FROM checkins WHERE user_id = ? AND shared = 1 ORDER BY id DESC LIMIT 10`, s.id)
  const privateCheckins = get(`SELECT COUNT(*) n FROM checkins WHERE user_id = ? AND shared = 0`, s.id).n
  res.json({ student: sum, history, badges, sharedCheckins: shared, privateCheckins })
})

app.post('/api/teacher/students/:id/password', teacher, (req, res) => {
  const s = get(`SELECT id FROM users WHERE id = ? AND role = 'student' AND class_id = ?`, Number(req.params.id), req.user.class_id)
  if (!s) return bad(res, 'Student not found in your class.', 404)
  const pw = String(req.body?.password ?? '')
  if (pw.length < 6) return bad(res, 'Passwords need at least 6 characters.')
  run(`UPDATE users SET password_hash = ? WHERE id = ?`, hashPassword(pw), s.id)
  res.json({ ok: true })
})

function validScenario(body) {
  const d = body || {}
  const out = {
    title: clean(d.title, 80),
    blurb: clean(d.blurb, 160),
    scene: SCENES.includes(d.scene) ? d.scene : 'classroom',
    who: CAST[d.who] && !CAST[d.who].adult ? d.who : 'amani',
    emotion: ['happy', 'sad', 'angry', 'worried', 'frustrated', 'neutral', 'embarrassed', 'scared'].includes(d.emotion) ? d.emotion : 'neutral',
    intro: clean(d.intro, 800),
    line: clean(d.line, 300),
    reflect: clean(d.reflect, 200),
    skills: (Array.isArray(d.skills) ? d.skills : []).filter(s => s in SKILLS).slice(0, 4),
    choices: (Array.isArray(d.choices) ? d.choices : []).slice(0, 4).map(c => ({
      text: clean(c.text, 200),
      quality: ['helpful', 'mixed', 'unhelpful'].includes(c.quality) ? c.quality : 'mixed',
      reaction: clean(c.reaction, 400),
      feel: clean(c.feel, 300),
      why: clean(c.why, 400),
      alternatives: (Array.isArray(c.alternatives) ? c.alternatives : []).map(x => clean(x, 200)).filter(Boolean).slice(0, 3),
    })),
  }
  if (out.title.length < 3) return { error: 'Give your scenario a title.' }
  if (out.intro.length < 10) return { error: 'Describe the situation in a sentence or two.' }
  if (out.choices.length < 2) return { error: 'Add at least two choices.' }
  if (out.choices.some(c => !c.text || !c.reaction)) return { error: 'Every choice needs the choice text and what happens next.' }
  if (!out.choices.some(c => c.quality === 'helpful')) return { error: 'Include at least one helpful choice so students can see a good path.' }
  return { data: out }
}

app.get('/api/teacher/scenarios', teacher, (req, res) => {
  const rows = all(`SELECT * FROM scenarios WHERE class_id = ? ORDER BY id DESC`, req.user.class_id)
  res.json({ scenarios: rows.map(r => ({ id: r.id, activityId: `custom-${r.id}`, active: !!r.active, created_at: r.created_at, data: JSON.parse(r.data), plays: get(`SELECT COUNT(*) n FROM completions WHERE activity_id = ?`, `custom-${r.id}`).n })) })
})

app.post('/api/teacher/scenarios', teacher, (req, res) => {
  const v = validScenario(req.body)
  if (v.error) return bad(res, v.error)
  const r = run(`INSERT INTO scenarios (class_id, teacher_id, data) VALUES (?, ?, ?)`, req.user.class_id, req.user.id, JSON.stringify(v.data))
  res.json({ id: r.lastInsertRowid })
})

app.put('/api/teacher/scenarios/:id', teacher, (req, res) => {
  const row = get(`SELECT * FROM scenarios WHERE id = ? AND class_id = ?`, Number(req.params.id), req.user.class_id)
  if (!row) return bad(res, 'Scenario not found.', 404)
  if (req.body && typeof req.body.active === 'boolean' && Object.keys(req.body).length === 1) {
    run(`UPDATE scenarios SET active = ? WHERE id = ?`, req.body.active ? 1 : 0, row.id)
    return res.json({ ok: true })
  }
  const v = validScenario(req.body)
  if (v.error) return bad(res, v.error)
  run(`UPDATE scenarios SET data = ? WHERE id = ?`, JSON.stringify(v.data), row.id)
  res.json({ ok: true })
})

app.delete('/api/teacher/scenarios/:id', teacher, (req, res) => {
  const id = Number(req.params.id)
  tx(() => {
    run(`DELETE FROM assignments WHERE class_id = ? AND activity_id = ?`, req.user.class_id, `custom-${id}`)
    run(`DELETE FROM scenarios WHERE id = ? AND class_id = ?`, id, req.user.class_id)
  })
  res.json({ ok: true })
})

app.get('/api/teacher/assignments', teacher, (req, res) => {
  const customs = customFor(req.user.class_id)
  const total = get(`SELECT COUNT(*) n FROM users WHERE role = 'student' AND class_id = ?`, req.user.class_id).n
  const rows = all(`SELECT * FROM assignments WHERE class_id = ? ORDER BY id DESC`, req.user.class_id).map(a => {
    const meta = BY_ID[a.activity_id] || customs.find(c => c.id === a.activity_id)
    const done = get(`SELECT COUNT(DISTINCT c.user_id) n FROM completions c JOIN users u ON u.id = c.user_id WHERE c.activity_id = ? AND u.class_id = ?`, a.activity_id, req.user.class_id).n
    return { ...a, title: meta?.title || a.activity_id, mode: meta?.mode || 'conflict', done, total }
  })
  res.json({ assignments: rows, options: [...ALL_CONTENT.map(summary), ...customs.map(c => ({ id: c.id, mode: c.mode, title: c.title, custom: true }))] })
})

app.post('/api/teacher/assignments', teacher, (req, res) => {
  const id = clean(req.body?.activityId, 80)
  const customs = customFor(req.user.class_id)
  if (!BY_ID[id] && !customs.find(c => c.id === id)) return bad(res, 'Pick a mission to assign.')
  const due = /^\d{4}-\d{2}-\d{2}$/.test(req.body?.due || '') ? req.body.due : null
  run(`INSERT INTO assignments (class_id, activity_id, note, due) VALUES (?, ?, ?, ?)`, req.user.class_id, id, clean(req.body?.note, 200) || null, due)
  res.json({ ok: true })
})

app.delete('/api/teacher/assignments/:id', teacher, (req, res) => {
  run(`DELETE FROM assignments WHERE id = ? AND class_id = ?`, Number(req.params.id), req.user.class_id)
  res.json({ ok: true })
})

app.use('/api', (req, res) => bad(res, 'Not found.', 404))

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
if (existsSync(dist)) {
  app.use(express.static(dist))
  app.get(/^(?!\/api).*/, (req, res) => res.sendFile(join(dist, 'index.html')))
}

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong on our side. Please try again.' })
})

const port = Number(process.env.PORT) || 4180
app.listen(port, () => console.log(`PeaceQuest API on http://localhost:${port}`))
