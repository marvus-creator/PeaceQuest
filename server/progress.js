import { all, get, run } from './db.js'
import { BY_ID, customToStory } from '../shared/catalog.js'
import { BADGES, REGIONS, SKILLS, levelInfo, dailyFor, todayStr } from '../shared/progression.js'

export function customFor(classId) {
  if (!classId) return []
  return all(`SELECT * FROM scenarios WHERE class_id = ? AND active = 1 ORDER BY id`, classId).map(r => customToStory({ ...r, data: JSON.parse(r.data) }))
}

export function findActivity(id, classId) {
  if (BY_ID[id]) return BY_ID[id]
  if (id.startsWith('custom-')) {
    const row = get(`SELECT * FROM scenarios WHERE id = ? AND class_id = ? AND active = 1`, Number(id.slice(7)), classId)
    if (row) return customToStory({ ...row, data: JSON.parse(row.data) })
  }
  return null
}

function activityMeta(id, customs) {
  return BY_ID[id] || customs.find(c => c.id === id) || null
}

export function computeStats(userId, customs = []) {
  const comps = all(`SELECT activity_id, mode, ending, score, xp, detail, rewinds, reflected, day, created_at FROM completions WHERE user_id = ? ORDER BY id`, userId)
  const per = {}
  const endings = new Set()
  let rewinds = 0
  let calmCount = 0
  const detectiveBest = {}
  const skillXp = Object.fromEntries(Object.keys(SKILLS).map(k => [k, 0]))
  for (const c of comps) {
    const p = (per[c.activity_id] ||= { plays: 0, best: 0, endings: [], last: null })
    p.plays++
    p.best = Math.max(p.best, c.score || 0)
    p.last = c.created_at
    if (c.ending && !p.endings.includes(c.ending)) { p.endings.push(c.ending); endings.add(`${c.activity_id}:${c.ending}`) }
    rewinds += c.rewinds
    if (c.mode === 'calm') calmCount++
    if (c.mode === 'detective') {
      const d = c.detail ? JSON.parse(c.detail) : {}
      detectiveBest[c.activity_id] = Math.max(detectiveBest[c.activity_id] || 0, d.solved || 0)
    }
    const meta = activityMeta(c.activity_id, customs)
    for (const s of meta?.skills || []) if (s in skillXp) skillXp[s] += c.xp
  }
  const byMode = {}
  for (const id of Object.keys(per)) {
    const mode = activityMeta(id, customs)?.mode || (id.startsWith('custom-') ? 'conflict' : null)
    if (mode) byMode[mode] = (byMode[mode] || 0) + 1
  }
  const reflections = get(`SELECT COUNT(*) n FROM journal WHERE user_id = ?`, userId).n
  const checkins = get(`SELECT COUNT(*) n FROM checkins WHERE user_id = ?`, userId).n
  return {
    comps,
    per,
    stats: {
      completedUnique: Object.keys(per).length,
      byMode,
      detectiveCorrect: Object.values(detectiveBest).reduce((a, b) => a + b, 0),
      calmCount,
      reflections,
      rewinds,
      endingsFound: endings.size,
      modesTried: Object.keys(byMode).length,
      checkins,
    },
    skillXp,
  }
}

export function todayStats(userId, day) {
  const rows = all(`SELECT activity_id, mode, rewinds, reflected FROM completions WHERE user_id = ? AND day = ?`, userId, day)
  const byMode = {}
  let breathing = 0
  let rewinds = 0
  for (const r of rows) {
    byMode[r.mode] = (byMode[r.mode] || 0) + 1
    if (r.activity_id === 'calm-balloon' || r.activity_id === 'calm-box') breathing++
    rewinds += r.rewinds
  }
  const reflections = get(`SELECT COUNT(*) n FROM journal WHERE user_id = ? AND date(created_at, 'localtime') = ?`, userId, day).n
  const checkins = get(`SELECT COUNT(*) n FROM checkins WHERE user_id = ? AND day = ?`, userId, day).n
  return { byMode, breathing, rewinds, reflections, checkins, completions: rows.length }
}

export function awardBadges(userId) {
  const user = get(`SELECT class_id FROM users WHERE id = ?`, userId)
  const { stats } = computeStats(userId, customFor(user?.class_id))
  const have = new Set(all(`SELECT badge_id FROM badges WHERE user_id = ?`, userId).map(r => r.badge_id))
  const fresh = []
  for (const b of BADGES) {
    if (!have.has(b.id) && b.check(stats)) {
      run(`INSERT INTO badges (user_id, badge_id) VALUES (?, ?)`, userId, b.id)
      fresh.push({ id: b.id, name: b.name, desc: b.desc, icon: b.icon })
    }
  }
  return fresh
}

export function isUnlocked(activity, level, per, assigned) {
  if (assigned.has(activity.id)) return true
  const region = REGIONS.find(r => r.id === activity.mode)
  if (region && level < region.unlock) return false
  if (activity.requires && !per[activity.requires]) return false
  return true
}

export function buildProgress(userId) {
  const user = get(`SELECT id, name, username, class_id, avatar, xp FROM users WHERE id = ?`, userId)
  const customs = customFor(user.class_id)
  const { per, stats, skillXp } = computeStats(userId, customs)
  const lvl = levelInfo(user.xp)
  const day = todayStr()
  const ts = todayStats(userId, day)
  const claimed = new Set(all(`SELECT challenge_id FROM daily_claims WHERE user_id = ? AND day = ?`, userId, day).map(r => r.challenge_id))
  const daily = dailyFor(day, lvl.level).map(d => ({ id: d.id, text: d.text, xp: d.xp, done: d.check(ts), claimed: claimed.has(d.id) }))
  const earned = Object.fromEntries(all(`SELECT badge_id, earned_at FROM badges WHERE user_id = ?`, userId).map(r => [r.badge_id, r.earned_at]))
  const badges = BADGES.map(b => ({ id: b.id, name: b.name, desc: b.desc, icon: b.icon, earned: earned[b.id] || null }))
  const assignments = user.class_id
    ? all(`SELECT id, activity_id, note, due, created_at FROM assignments WHERE class_id = ? ORDER BY id DESC`, user.class_id)
        .map(a => {
          const meta = activityMeta(a.activity_id, customs)
          return meta ? { ...a, title: meta.title, mode: meta.mode, done: !!per[a.activity_id] } : null
        })
        .filter(Boolean)
    : []
  const assigned = new Set(assignments.map(a => a.activity_id))
  const regions = REGIONS.map(r => ({ ...r, unlocked: lvl.level >= r.unlock || assignments.some(a => a.mode === r.id) }))
  const unlocked = {}
  for (const id of Object.keys(BY_ID)) unlocked[id] = isUnlocked(BY_ID[id], lvl.level, per, assigned)
  for (const c of customs) unlocked[c.id] = true
  const recent = all(`SELECT activity_id, mode, tone, xp, created_at FROM completions WHERE user_id = ? ORDER BY id DESC LIMIT 6`, userId)
    .map(r => ({ ...r, title: activityMeta(r.activity_id, customs)?.title || 'Mission' }))
  return {
    level: lvl,
    stats,
    per,
    skillXp,
    daily,
    badges,
    regions,
    unlocked,
    assignments,
    recent,
    custom: customs.map(c => ({ id: c.id, mode: c.mode, kind: c.kind, title: c.title, blurb: c.blurb, skills: c.skills, minutes: c.minutes, custom: true })),
  }
}
