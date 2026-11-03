const CHOICE_XP = { helpful: 15, mixed: 10, unhelpful: 5 }
const SLOT_XP = { helpful: 8, mixed: 5, unhelpful: 2 }

function reflected(r) {
  if (!r) return false
  if (r.chip) return true
  return typeof r.text === 'string' && r.text.trim().length >= 8
}

export function scoreStory(story, payload) {
  const path = Array.isArray(payload?.path) ? payload.path : []
  let nodeId = story.start
  const steps = []
  for (const choiceId of path) {
    const node = story.nodes[nodeId]
    if (!node || !node.choices) return { valid: false, error: 'Path continues past an ending.' }
    const choice = node.choices.find(c => c.id === choiceId)
    if (!choice) return { valid: false, error: `Unknown choice ${choiceId}.` }
    steps.push({ node: nodeId, choice: choice.id, q: choice.q })
    nodeId = choice.next
  }
  const last = story.nodes[nodeId]
  if (!last || !last.end) return { valid: false, error: 'Story not finished.' }
  const breakdown = [{ label: 'Story completed', xp: 40 }]
  for (const s of steps) breakdown.push({ label: s.q === 'helpful' ? 'Thoughtful choice' : s.q === 'mixed' ? 'Choice explored' : 'Learning moment', xp: CHOICE_XP[s.q] || 5 })
  const didReflect = reflected(payload.reflection)
  if (didReflect) breakdown.push({ label: 'Reflection', xp: 15 })
  const rewinds = Math.max(0, Math.min(20, Number(payload.rewinds) || 0))
  if (rewinds > 0) breakdown.push({ label: 'Explored another path', xp: 10 })
  const helpful = steps.filter(s => s.q === 'helpful').length
  return {
    valid: true,
    ending: nodeId,
    tone: last.end.tone,
    steps,
    breakdown,
    score: steps.length ? Math.round((helpful / steps.length) * 100) : 0,
    reflected: didReflect,
    rewinds,
    stats: { helpful, choices: steps.length },
  }
}

export function scoreDetective(file, payload) {
  const answers = Array.isArray(payload?.answers) ? payload.answers : []
  if (answers.length !== file.cases.length) return { valid: false, error: 'All cases must be answered.' }
  const breakdown = [{ label: 'Case file closed', xp: 30 }]
  let first = 0
  let solved = 0
  answers.forEach((a, i) => {
    const c = file.cases[i]
    const okFirst = c.answer.includes(a?.first)
    const okFinal = okFirst || c.answer.includes(a?.second)
    if (okFirst) { first++; solved++; breakdown.push({ label: `Case ${i + 1} spotted`, xp: 10 }) }
    else if (okFinal) { solved++; breakdown.push({ label: `Case ${i + 1} solved on 2nd look`, xp: 6 }) }
    else breakdown.push({ label: `Case ${i + 1} studied`, xp: 2 })
  })
  return {
    valid: true,
    breakdown,
    score: Math.round((first / file.cases.length) * 100),
    stats: { first, solved, total: file.cases.length },
    reflected: false,
    rewinds: 0,
  }
}

export function scoreEmpathy(journey, payload) {
  const feels = payload?.feels || {}
  const breakdown = [{ label: 'Journey completed', xp: 50 }]
  for (const step of journey.steps.filter(s => s.type === 'feel')) {
    const picked = Array.isArray(feels[step.who]) ? feels[step.who] : []
    if (!picked.length) return { valid: false, error: `Feelings for ${step.who} missing.` }
    const overlap = picked.filter(f => step.likely.includes(f)).length
    breakdown.push({ label: `Imagined how ${step.who} feels`, xp: 10 + Math.min(6, overlap * 2) })
  }
  const choiceStep = journey.steps.find(s => s.type === 'choice')
  let q = null
  if (choiceStep) {
    const opt = choiceStep.options[Number(payload?.choice)]
    if (!opt) return { valid: false, error: 'Choice missing.' }
    q = opt.q
    breakdown.push({ label: q === 'helpful' ? 'Thoughtful choice' : q === 'mixed' ? 'Choice explored' : 'Learning moment', xp: CHOICE_XP[q] })
  }
  const didReflect = reflected(payload?.reflection)
  if (didReflect) breakdown.push({ label: 'Reflection', xp: 15 })
  return { valid: true, breakdown, score: q === 'helpful' ? 100 : q === 'mixed' ? 60 : 30, reflected: didReflect, rewinds: 0, stats: { choice: q } }
}

export function scoreBuilder(builder, payload) {
  const picks = Array.isArray(payload?.picks) ? payload.picks : []
  if (picks.length !== builder.rounds.length) return { valid: false, error: 'All rounds must be built.' }
  const breakdown = [{ label: 'Challenge completed', xp: 40 }]
  let helpful = 0
  let slots = 0
  for (let r = 0; r < builder.rounds.length; r++) {
    const round = builder.rounds[r]
    const rp = picks[r]
    if (!Array.isArray(rp) || rp.length !== round.slots.length) return { valid: false, error: `Round ${r + 1} incomplete.` }
    let xp = 0
    round.slots.forEach((slot, i) => {
      const opt = slot.options[rp[i]]
      if (!opt) return
      slots++
      if (opt.q === 'helpful') helpful++
      xp += SLOT_XP[opt.q]
    })
    breakdown.push({ label: `Message ${r + 1} built`, xp })
  }
  return { valid: true, breakdown, score: slots ? Math.round((helpful / slots) * 100) : 0, reflected: false, rewinds: 0, stats: { helpful, slots } }
}

export function scoreCalm(activity, payload) {
  const breakdown = [{ label: activity.title, xp: 20 }]
  const didReflect = activity.id === 'calm-reflect' && reflected(payload?.reflection)
  return { valid: true, breakdown, score: 100, reflected: didReflect, rewinds: 0, stats: {} }
}

export function scoreActivity(activity, payload) {
  switch (activity.kind) {
    case 'story': return scoreStory(activity, payload)
    case 'detective': return scoreDetective(activity, payload)
    case 'empathy': return scoreEmpathy(activity, payload)
    case 'builder': return scoreBuilder(activity, payload)
    case 'calm': return scoreCalm(activity, payload)
    default: return { valid: false, error: 'Unknown activity type.' }
  }
}
