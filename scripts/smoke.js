const BASE = process.env.BASE || 'http://localhost:4180/api'
let failed = 0
const ok = (cond, msg) => { console.log(`${cond ? 'ok  ' : 'FAIL'} ${msg}`); if (!cond) failed++ }

async function call(path, { token, method = 'GET', body } = {}) {
  const res = await fetch(BASE + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined })
  return { status: res.status, data: await res.json().catch(() => ({})) }
}

const s = await call('/auth/login', { method: 'POST', body: { username: 'amani', password: 'peace123' } })
ok(s.status === 200 && s.data.token, 'student login')
const st = s.data.token
const bad = await call('/auth/login', { method: 'POST', body: { username: 'amani', password: 'nope' } })
ok(bad.status === 401, 'wrong password rejected')

const p = await call('/progress', { token: st })
ok(p.status === 200 && p.data.level.level >= 1, `progress loads (level ${p.data.level?.level}, xp ${p.data.level?.xp})`)
ok(Array.isArray(p.data.daily) && p.data.daily.length === 3, 'three daily challenges')

const forbidden = await call('/teacher/overview', { token: st })
ok(forbidden.status === 403, 'student blocked from teacher overview')
const forbidden2 = await call('/teacher/scenarios', { token: st, method: 'POST', body: {} })
ok(forbidden2.status === 403, 'student blocked from creating scenarios')
const anon = await call('/progress')
ok(anon.status === 401, 'anonymous blocked')

const act = await call('/activity/conflict-tablet', { token: st })
ok(act.status === 200 && act.data.activity.nodes, 'fetch story')
const cheat = await call('/play/complete', { token: st, method: 'POST', body: { activityId: 'conflict-tablet', payload: { path: ['zzz'] } } })
ok(cheat.status === 400, 'invalid path rejected')
const before = p.data.level.xp
const done = await call('/play/complete', { token: st, method: 'POST', body: { activityId: 'conflict-tablet', payload: { path: ['pull', 'blame'], rewinds: 1, reflection: { prompt: 'x', text: 'I would take turns next time.' } } } })
ok(done.status === 200 && done.data.xp > 0, `story completes (+${done.data.xp} XP: ${done.data.breakdown?.map(b => b.label).join(', ')})`)
ok(done.data.progress.level.xp === before + done.data.xp, 'XP saved to account')

const locked = await call('/activity/empathy-model', { token: st })
ok(locked.status === 403 || locked.status === 200, `locked mission check (status ${locked.status})`)

const ck = await call('/calm/checkin', { token: st, method: 'POST', body: { mood: 'happy', intensity: 3, shared: false } })
ok(ck.status === 200, 'check-in saved')
const j = await call('/journal', { token: st })
ok(j.status === 200 && j.data.entries.length > 0, `journal has ${j.data.entries?.length} entries`)

const t = await call('/auth/login', { method: 'POST', body: { username: 'teacher@peacequest.school', password: 'peace1234' } })
ok(t.status === 200 && t.data.user.role === 'teacher', 'teacher login')
const tt = t.data.token
const ov = await call('/teacher/overview', { token: tt })
ok(ov.status === 200 && ov.data.students.length === 8, `overview: ${ov.data.students?.length} students, ${ov.data.totals?.plays} plays`)
ok(!JSON.stringify(ov.data).includes('I would take turns next time'), 'reflection text NOT exposed to teacher')
ok(!JSON.stringify(ov.data).includes('Private note'), 'private check-in notes NOT exposed')
ok(JSON.stringify(ov.data).includes('My dog is sick'), 'shared check-in visible to teacher')
const sd = await call(`/teacher/students/${ov.data.students[0].id}`, { token: tt })
ok(sd.status === 200 && Array.isArray(sd.data.history), 'student detail')

const sc = await call('/teacher/scenarios', { token: tt, method: 'POST', body: { title: 'Smoke test', intro: 'Two children want the same chair at the reading corner.', choices: [{ text: 'Share it', quality: 'helpful', reaction: 'They take turns.' }, { text: 'Grab it', quality: 'unhelpful', reaction: 'They argue.' }] } })
ok(sc.status === 200, 'teacher creates scenario')
const pr = await call('/progress', { token: st })
const cid = `custom-${sc.data.id}`
ok(pr.data.custom.some(c => c.id === cid), 'student sees custom scenario')
const cdone = await call('/play/complete', { token: st, method: 'POST', body: { activityId: cid, payload: { path: ['c0'] } } })
ok(cdone.status === 200, 'student plays custom scenario')
await call(`/teacher/scenarios/${sc.data.id}`, { token: tt, method: 'DELETE' })

const as = await call('/teacher/assignments', { token: tt })
ok(as.status === 200 && as.data.assignments.length >= 1, 'assignments list')

console.log(failed ? `\n${failed} FAILED` : '\nAll smoke checks passed.')
process.exit(failed ? 1 : 0)
