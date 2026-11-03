import { rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dbFile = process.env.PEACEQUEST_DB || join(root, 'data', 'peacequest.db')
for (const f of [dbFile, dbFile + '-wal', dbFile + '-shm']) if (existsSync(f)) rmSync(f)

const { run, get, tx } = await import('./db.js')
const { hashPassword } = await import('./auth.js')
const { awardBadges } = await import('./progress.js')
const { BY_ID } = await import('../shared/catalog.js')
const { scoreActivity } = await import('../shared/scoring.js')
const { todayStr } = await import('../shared/progression.js')

let seed = 7
const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
const pick = arr => arr[Math.floor(rand() * arr.length)]

const classRow = run(`INSERT INTO classes (name, code) VALUES (?, ?)`, 'Class 5 Sunflowers', 'SUN-42')
const classId = classRow.lastInsertRowid
const t = run(`INSERT INTO users (role, username, name, password_hash, class_id, last_active) VALUES ('teacher', ?, ?, ?, ?, datetime('now'))`, 'teacher@peacequest.school', 'Ms. Uwase', hashPassword('peace1234'), classId)
run(`UPDATE classes SET teacher_id = ? WHERE id = ?`, t.lastInsertRowid, classId)

const STUDENTS = [
  { u: 'amani', n: 'Amani', a: { skin: '#8D5A3B', hair: 'short', hairColor: '#1A120C', shirt: '#2F9C95', extra: 'none' }, plays: 16, kind: 0.8 },
  { u: 'keza', n: 'Keza', a: { skin: '#6B4229', hair: 'puffs', hairColor: '#1A120C', shirt: '#F2836B', extra: 'headband' }, plays: 12, kind: 0.75 },
  { u: 'leo', n: 'Leo', a: { skin: '#F3D2B3', hair: 'messy', hairColor: '#B5651D', shirt: '#7EC4E6', extra: 'freckles' }, plays: 7, kind: 0.5 },
  { u: 'zara', n: 'Zara', a: { skin: '#C68B59', hair: 'long', hairColor: '#3B2414', shirt: '#9C8FD6', extra: 'none' }, plays: 10, kind: 0.7 },
  { u: 'kofi', n: 'Kofi', a: { skin: '#4E3020', hair: 'buzz', hairColor: '#1A120C', shirt: '#F5C451', extra: 'cap' }, plays: 5, kind: 0.45 },
  { u: 'mei', n: 'Mei', a: { skin: '#F3D2B3', hair: 'bob', hairColor: '#1A120C', shirt: '#6BAF6B', extra: 'glasses' }, plays: 9, kind: 0.85 },
  { u: 'tomas', n: 'Tomás', a: { skin: '#D9A577', hair: 'curly', hairColor: '#3B2414', shirt: '#E9A23B', extra: 'none' }, plays: 3, kind: 0.6 },
  { u: 'nia', n: 'Nia', a: { skin: '#A86B45', hair: 'braids', hairColor: '#1A120C', shirt: '#E57A9A', extra: 'none' }, plays: 13, kind: 0.8 },
]

const ORDER = [
  'calm-balloon', 'detective-faces', 'conflict-football', 'conflict-tablet', 'calm-checkin', 'conflict-markers', 'detective-body',
  'friend-newkid', 'calm-box', 'conflict-project', 'friend-teams', 'detective-stories', 'comm-listen', 'calm-grounding',
  'conflict-excluded', 'friend-disagree', 'comm-disagree', 'empathy-goal', 'conflict-rumor',
]

const REFLECTIONS = [
  'I would take a breath first and ask what happened.',
  'I think I would feel embarrassed too, so I would try to be kind.',
  'Talking to a teacher would help me when it is too big.',
  'Next time I want to listen before I answer.',
]

function storyPath(story, kind) {
  const path = []
  let id = story.start
  while (story.nodes[id].choices) {
    const choices = story.nodes[id].choices
    const good = choices.filter(c => c.q === 'helpful')
    const c = rand() < kind && good.length ? pick(good) : pick(choices)
    path.push(c.id)
    id = c.next
  }
  return path
}

function payloadFor(a, kind) {
  const reflection = rand() < 0.6 ? { prompt: a.nodes?.[a.start] ? 'Reflection' : a.reflect || 'Reflection', text: pick(REFLECTIONS) } : null
  if (a.kind === 'story') return { path: storyPath(a, kind), reflection, rewinds: rand() < 0.25 ? 1 : 0 }
  if (a.kind === 'detective') return { answers: a.cases.map(c => rand() < kind + 0.1 ? { first: c.answer[0] } : { first: c.options.find(o => !c.answer.includes(o)), second: c.answer[0] }) }
  if (a.kind === 'empathy') return { feels: Object.fromEntries(a.steps.filter(s => s.type === 'feel').map(s => [s.who, s.likely.slice(0, 3)])), choice: 0, reflection }
  if (a.kind === 'builder') return { picks: a.rounds.map(r => r.slots.map(s => Math.max(0, s.options.findIndex(o => o.q === 'helpful')))) }
  return {}
}

tx(() => {
  for (const s of STUDENTS) {
    const u = run(`INSERT INTO users (role, username, name, password_hash, class_id, avatar) VALUES ('student', ?, ?, ?, ?, ?)`, s.u, s.n, hashPassword('peace123'), classId, JSON.stringify(s.a))
    const uid = u.lastInsertRowid
    let xp = 0
    const done = new Set()
    for (let i = 0; i < s.plays; i++) {
      const id = ORDER[Math.min(i, ORDER.length - 1)]
      const a = BY_ID[id]
      const payload = payloadFor(a, s.kind)
      const r = scoreActivity(a, payload)
      if (!r.valid) throw new Error(`${id}: ${r.error}`)
      const gained = done.has(id) ? 10 : r.breakdown.reduce((x, b) => x + b.xp, 0)
      done.add(id)
      const daysAgo = Math.floor(rand() * 9)
      const when = new Date(Date.now() - daysAgo * 86400000 - Math.floor(rand() * 6) * 3600000)
      const stamp = when.toISOString().slice(0, 19).replace('T', ' ')
      run(`INSERT INTO completions (user_id, activity_id, mode, ending, tone, score, xp, detail, reflected, rewinds, day, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        uid, id, a.mode, r.ending || null, r.tone || null, r.score, gained, JSON.stringify({ ...r.stats, steps: r.steps }), r.reflected ? 1 : 0, r.rewinds || 0, todayStr(when), stamp)
      if (r.reflected) run(`INSERT INTO journal (user_id, activity_id, prompt, text, created_at) VALUES (?, ?, ?, ?, ?)`, uid, id, 'Reflection', payload.reflection.text, stamp)
      xp += gained
    }
    const moods = ['happy', 'calm', 'excited', 'tired', 'worried']
    for (let i = 0; i < Math.min(4, Math.floor(s.plays / 3)); i++) {
      const shared = s.u === 'kofi' && i === 0 ? 1 : 0
      const mood = shared ? 'worried' : pick(moods)
      run(`INSERT INTO checkins (user_id, mood, intensity, note, shared, day) VALUES (?, ?, ?, ?, ?, ?)`, uid, mood, shared ? 4 : 2 + Math.floor(rand() * 3), shared ? 'My dog is sick and I can’t stop thinking about it.' : 'Private note', shared, todayStr())
    }
    const lastActive = new Date(Date.now() - Math.floor(rand() * 4) * 86400000).toISOString().slice(0, 19).replace('T', ' ')
    run(`UPDATE users SET xp = ?, last_active = ? WHERE id = ?`, xp, lastActive, uid)
    awardBadges(uid)
  }

  const scenario = {
    title: 'The Borrowed Jersey',
    blurb: 'A friend returns your sports jersey with a big stain on it.',
    scene: 'hallway',
    who: 'amani',
    emotion: 'worried',
    intro: 'You lent Amani your sports jersey for the weekend match. On Monday, Amani gives it back with a big grass stain on the front. You need it for your own game on Wednesday.',
    line: 'Here’s your jersey… I’m really sorry about the stain. I tried to wash it.',
    reflect: 'How can you tell a friend you’re upset while still being kind?',
    skills: ['conflict', 'communication', 'friendship'],
    choices: [
      { text: '“Thanks for telling me. I’m a bit upset because I need it Wednesday. Could you help me try to clean it?”', quality: 'helpful', reaction: 'Amani nods. “Of course! My mum has a stain spray that really works.” The jersey is clean by Tuesday.', feel: 'Amani felt guilty but relieved that you were honest and kind.', why: 'You said how you felt and asked for help to fix it. That solves the problem and keeps the friendship strong.', alternatives: [] },
      { text: '“You ruined it! I’m never lending you anything again.”', quality: 'unhelpful', reaction: 'Amani’s face falls. “I said I was sorry…” Amani walks away and avoids you for the rest of the day.', feel: 'Amani felt ashamed and hurt, even though they tried to fix it.', why: 'Being upset about the stain is fair. But harsh words made Amani feel like a bad person instead of helping fix the jersey.', alternatives: ['Say how you feel without blaming: “I’m upset because I need it Wednesday.”', 'Ask Amani to help you clean it.'] },
      { text: 'Say “It’s fine” even though you’re upset.', quality: 'mixed', reaction: 'Amani smiles with relief. But on Wednesday you play in a stained jersey and feel annoyed all game.', feel: 'Amani feels fine. They don’t know you are still upset.', why: 'Being calm is good, but hiding your feelings means the problem doesn’t get fixed.', alternatives: ['“Thanks for trying to wash it. Can we try once more before Wednesday?”'] },
    ],
  }
  run(`INSERT INTO scenarios (class_id, teacher_id, data) VALUES (?, ?, ?)`, classId, t.lastInsertRowid, JSON.stringify(scenario))
  run(`INSERT INTO assignments (class_id, activity_id, note, due) VALUES (?, ?, ?, ?)`, classId, 'conflict-bully', 'We talked about bullying in class today. Try this story and think about who you could tell.', todayStr(new Date(Date.now() + 3 * 86400000)))
  run(`INSERT INTO assignments (class_id, activity_id, note, due) VALUES (?, ?, ?, ?)`, classId, 'custom-1', 'A scenario I wrote for our class!', null)
})

const counts = get(`SELECT (SELECT COUNT(*) FROM users) users, (SELECT COUNT(*) FROM completions) completions`)
console.log(`Seeded PeaceQuest: ${counts.users} users, ${counts.completions} completions.`)
console.log('Teacher:  teacher@peacequest.school / peace1234   (class code SUN-42)')
console.log('Students: amani, keza, leo, zara, kofi, mei, tomas, nia  / peace123')
