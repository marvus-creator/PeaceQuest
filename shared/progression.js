export const SKILLS = {
  conflict: { label: 'Conflict resolution', color: '#F2836B' },
  emotions: { label: 'Understanding emotions', color: '#7EC4E6' },
  empathy: { label: 'Empathy', color: '#E57A9A' },
  communication: { label: 'Respectful communication', color: '#9C8FD6' },
  friendship: { label: 'Healthy friendships', color: '#6BAF6B' },
  calm: { label: 'Managing big feelings', color: '#4FB0A5' },
  decisions: { label: 'Responsible decisions', color: '#E9A23B' },
  cooperation: { label: 'Cooperation', color: '#5B8DEF' },
  bullying: { label: 'Handling bullying', color: '#7C6A9E' },
}

export const LEVELS = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3300, 4000]
export const LEVEL_TITLES = [
  'Seedling', 'Sprout', 'Kind Listener', 'Helping Hand', 'Bridge Builder', 'Calm Navigator',
  'Peacekeeper', 'Harmony Guide', 'Heart Explorer', 'Wise Lantern', 'Peace Champion', 'Legend of PeaceQuest',
]

export function levelInfo(xp) {
  let level = 1
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i]) level = i + 1
  const floor = LEVELS[level - 1]
  const ceil = LEVELS[level] ?? null
  return {
    level,
    title: LEVEL_TITLES[level - 1],
    xp,
    floor,
    next: ceil,
    progress: ceil ? (xp - floor) / (ceil - floor) : 1,
  }
}

export const REGIONS = [
  { id: 'calm', name: 'Calm Cove', mode: 'Calm Down Zone', unlock: 1, color: '#4FB0A5', blurb: 'Breathe slowly, check in with your feelings and find your calm.' },
  { id: 'detective', name: 'Mirror Lake', mode: 'Emotion Detective', unlock: 1, color: '#7EC4E6', blurb: 'Read faces, bodies and stories to discover how people feel.' },
  { id: 'conflict', name: 'Harmony Bridge', mode: 'Conflict Resolver', unlock: 1, color: '#F2836B', blurb: 'Disagreements happen. Choose what you would do and see where it leads.' },
  { id: 'friendship', name: 'Friendship Forest', mode: 'Friendship Quest', unlock: 2, color: '#6BAF6B', blurb: 'Make friends, include others and stand by people on hard days.' },
  { id: 'communication', name: 'Lantern Tower', mode: 'Communication Challenge', unlock: 3, color: '#9C8FD6', blurb: 'Find the words: listen well, disagree kindly, apologise and ask for help.' },
  { id: 'empathy', name: 'Echo Valley', mode: 'Empathy Journey', unlock: 4, color: '#E57A9A', blurb: 'Walk in someone else’s shoes and hear every side of the story.' },
]

export const BADGES = [
  { id: 'first-step', name: 'First Step', desc: 'Finish your very first mission.', icon: 'sprout', check: s => s.completedUnique >= 1 },
  { id: 'peace-maker', name: 'Peace Maker', desc: 'Finish 3 Conflict Resolver stories.', icon: 'bridge', check: s => (s.byMode.conflict || 0) >= 3 },
  { id: 'emotion-expert', name: 'Emotion Expert', desc: 'Spot 15 emotions correctly in Emotion Detective.', icon: 'magnifier', check: s => s.detectiveCorrect >= 15 },
  { id: 'friendship-builder', name: 'Friendship Builder', desc: 'Finish 3 Friendship Quests.', icon: 'hands', check: s => (s.byMode.friendship || 0) >= 3 },
  { id: 'great-listener', name: 'Great Listener', desc: 'Finish 3 Communication Challenges.', icon: 'ear', check: s => (s.byMode.communication || 0) >= 3 },
  { id: 'empathy-champion', name: 'Empathy Champion', desc: 'Finish 2 Empathy Journeys.', icon: 'heart', check: s => (s.byMode.empathy || 0) >= 2 },
  { id: 'calm-mind', name: 'Calm Mind', desc: 'Complete 5 Calm Down Zone activities.', icon: 'wave', check: s => s.calmCount >= 5 },
  { id: 'deep-thinker', name: 'Deep Thinker', desc: 'Answer 5 reflection questions.', icon: 'lantern', check: s => s.reflections >= 5 },
  { id: 'second-chances', name: 'Second Chances', desc: 'Rewind a story to try a different choice.', icon: 'rewind', check: s => s.rewinds >= 1 },
  { id: 'path-finder', name: 'Path Finder', desc: 'Discover 8 different story endings.', icon: 'compass', check: s => s.endingsFound >= 8 },
  { id: 'explorer', name: 'Island Explorer', desc: 'Try every region on the map.', icon: 'map', check: s => s.modesTried >= 6 },
  { id: 'feelings-friend', name: 'Feelings Friend', desc: 'Do 3 emotion check-ins.', icon: 'sun', check: s => s.checkins >= 3 },
]

export const DAILY_POOL = [
  { id: 'd-conflict', text: 'Finish a Conflict Resolver story', xp: 30, check: t => (t.byMode.conflict || 0) >= 1 },
  { id: 'd-detective', text: 'Solve an Emotion Detective case file', xp: 30, check: t => (t.byMode.detective || 0) >= 1 },
  { id: 'd-breathe', text: 'Do a breathing exercise in Calm Cove', xp: 25, check: t => t.breathing >= 1 },
  { id: 'd-checkin', text: 'Check in with how you feel today', xp: 20, check: t => t.checkins >= 1 },
  { id: 'd-reflect', text: 'Answer a reflection question', xp: 25, check: t => t.reflections >= 1 },
  { id: 'd-friend', text: 'Complete a Friendship Quest', xp: 30, check: t => (t.byMode.friendship || 0) >= 1 },
  { id: 'd-comm', text: 'Take on a Communication Challenge', xp: 30, check: t => (t.byMode.communication || 0) >= 1 },
  { id: 'd-rewind', text: 'Rewind a story and explore another path', xp: 25, check: t => t.rewinds >= 1 },
  { id: 'd-two', text: 'Finish any two missions', xp: 35, check: t => t.completions >= 2 },
]

export function dailyFor(dateStr, level = 1) {
  const avail = DAILY_POOL.filter(d => {
    if (d.id === 'd-friend') return level >= 2
    if (d.id === 'd-comm') return level >= 3
    return true
  })
  let seed = 0
  for (const ch of dateStr) seed = (seed * 31 + ch.charCodeAt(0)) % 100003
  const picks = []
  const pool = [...avail]
  while (picks.length < 3 && pool.length) {
    seed = (seed * 9301 + 49297) % 233280
    picks.push(pool.splice(seed % pool.length, 1)[0])
  }
  return picks
}

export function todayStr(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
