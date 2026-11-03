import { ALL_CONTENT, BY_ID } from '../shared/catalog.js'
import { CAST } from '../shared/cast.js'
import { scoreActivity } from '../shared/scoring.js'

const EMOTIONS = ['happy', 'sad', 'angry', 'scared', 'surprised', 'embarrassed', 'frustrated', 'worried', 'proud', 'calm', 'hopeful', 'neutral', 'smirk', 'shy', 'nervous']
let problems = 0
const fail = m => { problems++; console.log('  x ' + m) }

for (const a of ALL_CONTENT) {
  if (a.requires && !BY_ID[a.requires]) fail(`${a.id}: requires unknown ${a.requires}`)
  if (a.kind === 'story') {
    const seen = new Set()
    const walk = id => {
      if (seen.has(id)) return
      seen.add(id)
      const n = a.nodes[id]
      if (!n) return fail(`${a.id}: missing node ${id}`)
      for (const l of n.lines) {
        if (l.w !== 'narrator' && l.w !== 'you' && !CAST[l.w]) fail(`${a.id}/${id}: unknown speaker ${l.w}`)
        if (l.e && !EMOTIONS.includes(l.e)) fail(`${a.id}/${id}: unknown emotion ${l.e}`)
      }
      if (n.end) return
      if (!n.choices?.length) return fail(`${a.id}/${id}: no choices and no end`)
      n.choices.forEach(c => walk(c.next))
    }
    walk(a.start)
    for (const k of Object.keys(a.nodes)) if (!seen.has(k)) fail(`${a.id}: unreachable node ${k}`)
    const endings = Object.keys(a.nodes).filter(k => a.nodes[k].end).length
    const first = []
    let id = a.start
    while (a.nodes[id].choices) { const c = a.nodes[id].choices[0]; first.push(c.id); id = c.next }
    const r = scoreActivity(a, { path: first, reflection: { chip: 'x' } })
    if (!r.valid) fail(`${a.id}: score failed ${r.error}`)
    console.log(`ok ${a.id}  nodes=${seen.size} endings=${endings} xp=${r.breakdown.reduce((s, b) => s + b.xp, 0)}`)
  } else if (a.kind === 'detective') {
    a.cases.forEach((c, i) => { if (!c.answer.some(x => c.options.includes(x))) fail(`${a.id} case ${i}: no answer in options`) })
    console.log(`ok ${a.id}  cases=${a.cases.length}`)
  } else {
    console.log(`ok ${a.id}`)
  }
}
console.log(problems ? `\n${problems} problem(s)` : '\nAll content valid.')
process.exit(problems ? 1 : 0)
