import { CONFLICT_STORIES } from './content/conflict.js'
import { FRIENDSHIP_STORIES } from './content/friendship.js'
import { COMMUNICATION_STORIES, BUILDERS } from './content/communication.js'
import { EMPATHY_JOURNEYS } from './content/empathy.js'
import { DETECTIVE_FILES } from './content/detective.js'

export const CALM_ACTIVITIES = [
  { id: 'calm-balloon', mode: 'calm', kind: 'calm', title: 'Balloon Breathing', blurb: 'Fill a balloon slowly with your breath, then let it float down.', skills: ['calm'], minutes: 2, tag: 'breathing' },
  { id: 'calm-box', mode: 'calm', kind: 'calm', title: 'Box Breathing', blurb: 'Breathe around the four sides of a box: in, hold, out, hold.', skills: ['calm'], minutes: 2, tag: 'breathing' },
  { id: 'calm-grounding', mode: 'calm', kind: 'calm', title: '5-4-3-2-1 Senses', blurb: 'Notice the world around you to calm a busy mind.', skills: ['calm', 'emotions'], minutes: 3, tag: 'grounding' },
  { id: 'calm-squeeze', mode: 'calm', kind: 'calm', title: 'Squeeze & Release', blurb: 'Tighten and relax your muscles to let tension melt away.', skills: ['calm'], minutes: 3, tag: 'body' },
  { id: 'calm-checkin', mode: 'calm', kind: 'calm', title: 'Feelings Check-in', blurb: 'Notice how you feel right now and how big the feeling is.', skills: ['emotions', 'calm'], minutes: 1, tag: 'checkin' },
  { id: 'calm-reflect', mode: 'calm', kind: 'calm', title: 'Reflection Corner', blurb: 'A quiet moment to think and write about your day. Just for you.', skills: ['emotions', 'decisions'], minutes: 3, tag: 'reflect' },
]

const withKind = (list, kind) => list.map(s => ({ kind: s.kind || kind, ...s }))

export const ALL_CONTENT = [
  ...withKind(CONFLICT_STORIES, 'story'),
  ...withKind(FRIENDSHIP_STORIES, 'story'),
  ...withKind(COMMUNICATION_STORIES, 'story'),
  ...BUILDERS,
  ...EMPATHY_JOURNEYS,
  ...DETECTIVE_FILES,
  ...CALM_ACTIVITIES,
]

export const BY_ID = Object.fromEntries(ALL_CONTENT.map(a => [a.id, a]))

export function activitiesFor(mode) {
  return ALL_CONTENT.filter(a => a.mode === mode)
}

export function summary(a) {
  return { id: a.id, mode: a.mode, kind: a.kind, title: a.title, blurb: a.blurb, skills: a.skills, minutes: a.minutes, requires: a.requires || null, layout: a.layout || null }
}

export const SCENES = ['field', 'classroom', 'lunch', 'playground', 'library', 'hallway', 'bench']

export function customToStory(row) {
  const d = row.data
  const id = `custom-${row.id}`
  const nodes = {
    n1: {
      scene: d.scene || 'classroom',
      lines: [
        { w: 'narrator', t: d.intro },
        ...(d.line ? [{ w: d.who || 'amani', e: d.emotion || 'neutral', t: d.line }] : []),
      ],
      choices: d.choices.map((c, i) => ({ id: `c${i}`, t: c.text, q: c.quality, next: `end_${i}`, why: c.why })),
    },
  }
  d.choices.forEach((c, i) => {
    nodes[`end_${i}`] = {
      scene: d.scene || 'classroom',
      lines: [{ w: d.who || 'amani', e: c.emotion || (c.quality === 'helpful' ? 'happy' : c.quality === 'mixed' ? 'neutral' : 'sad'), t: c.reaction }],
      end: {
        tone: c.quality === 'helpful' ? 'bright' : c.quality === 'mixed' ? 'mixed' : 'stormy',
        title: c.quality === 'helpful' ? 'A helpful choice' : c.quality === 'mixed' ? 'Partly helpful' : 'Let’s learn from this',
        happened: c.reaction,
        feel: c.feel || '',
        why: c.why || '',
        try: (c.alternatives || []).filter(Boolean),
        reflect: d.reflect || 'What would you do if this happened to you?',
      },
    }
  })
  return {
    id,
    mode: 'conflict',
    kind: 'story',
    custom: true,
    title: d.title,
    blurb: d.blurb || 'A scenario from your teacher.',
    skills: d.skills && d.skills.length ? d.skills : ['conflict'],
    minutes: 3,
    cast: [d.who || 'amani'],
    start: 'n1',
    nodes,
  }
}
