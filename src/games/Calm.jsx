import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useGame } from '../state.jsx'
import Character from '../components/Character.jsx'
import Icon from '../components/Icons.jsx'
import { GuideNote, Sola } from '../components/Guide.jsx'
import { XPSummary } from '../components/Rewards.jsx'
import { DEFAULT_AVATAR } from '../../shared/cast.js'
import { useAuth } from '../state.jsx'

function useTicker(running, ms = 100) {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!running) return
    const start = performance.now() - t
    const id = setInterval(() => setT(performance.now() - start), ms)
    return () => clearInterval(id)
  }, [running])
  return [t, setT]
}

function Done({ activity, result, onReplay }) {
  return (
    <div className="result card">
      <XPSummary result={result} />
      <div className="result-side">
        <p className="small muted">Calm skills are like muscles. The more you practise when you&rsquo;re calm, the easier they work when feelings get big.</p>
        <div className="stack-s">
          <button className="btn primary" onClick={onReplay}><Icon name="rewind" size={16} /> Do it again</button>
          <Link className="btn" to="/play/region/calm">Back to Calm Cove</Link>
        </div>
      </div>
    </div>
  )
}

function useComplete(onFinish) {
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const done = async (payload = {}) => {
    setBusy(true); setErr('')
    try { setResult(await onFinish(payload)) } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }
  return { result, err, busy, done }
}

function Breathing({ activity, onFinish, onReplay, pattern, cycles }) {
  const [running, setRunning] = useState(false)
  const [t, setT] = useTicker(running)
  const { result, err, busy, done } = useComplete(onFinish)
  const cycleLen = pattern.reduce((s, p) => s + p.s, 0) * 1000
  const cycle = Math.floor(t / cycleLen)
  const within = t % cycleLen
  let acc = 0
  let phase = pattern[0]
  let phaseT = 0
  for (const p of pattern) {
    if (within < acc + p.s * 1000) { phase = p; phaseT = within - acc; break }
    acc += p.s * 1000
  }
  const finished = cycle >= cycles
  useEffect(() => { if (finished && running) setRunning(false) }, [finished, running])
  const frac = Math.min(1, phaseT / (phase.s * 1000))
  const scale = phase.k === 'in' ? 0.55 + 0.45 * frac : phase.k === 'out' ? 1 - 0.45 * frac : phase.k === 'hold-top' ? 1 : 0.55
  const secs = Math.ceil(phase.s - phaseT / 1000)
  const box = activity.id === 'calm-box'
  const sideIndex = pattern.indexOf(phase)
  const pos = (() => {
    const p = frac
    const pts = [[0, 1], [0, 0], [1, 0], [1, 1], [0, 1]]
    const a = pts[sideIndex]
    const b = pts[sideIndex + 1]
    return [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p]
  })()

  if (result) return <Done activity={activity} result={result} onReplay={onReplay} />
  return (
    <div className="calm-stage card">
      <div className="breath-visual">
        {box ? (
          <svg viewBox="0 0 240 240" className="box-breath">
            <rect x="30" y="30" width="180" height="180" rx="18" fill="#E3F3F1" stroke="#4FB0A5" strokeWidth="6" />
            {['Breathe in', 'Hold', 'Breathe out', 'Hold'].map((l, i) => {
              const xy = [[18, 120, -90], [120, 18, 0], [222, 120, 90], [120, 230, 0]][i]
              return <text key={i} x={xy[0]} y={xy[1]} textAnchor="middle" className={`box-label ${running && sideIndex === i ? 'on' : ''}`} transform={xy[2] ? `rotate(${xy[2]} ${xy[0]} ${xy[1]})` : undefined}>{l}</text>
            })}
            {running && <circle cx={30 + pos[0] * 180} cy={30 + pos[1] * 180} r="14" fill="#F5C451" stroke="#fff" strokeWidth="4" />}
          </svg>
        ) : (
          <svg viewBox="0 0 240 260" className="balloon">
            <g style={{ transform: `scale(${running ? scale : 0.6})`, transformOrigin: '120px 120px', transition: 'transform 120ms linear' }}>
              <ellipse cx="120" cy="110" rx="80" ry="92" fill="#F2836B" />
              <ellipse cx="92" cy="74" rx="18" ry="28" fill="#fff" opacity="0.35" />
              <path d="M112 200 L128 200 L120 212 Z" fill="#D96A55" />
            </g>
            <path d="M120 212 Q110 232 124 258" stroke="#8A8A9A" strokeWidth="2" fill="none" />
          </svg>
        )}
      </div>
      <div className="breath-info">
        {!running && !finished && (
          <>
            <h2>{activity.title}</h2>
            <p className="lead">{box ? 'Trace the box with your breath. Each side takes four seconds.' : 'Breathe in slowly through your nose as the balloon fills. Breathe out gently through your mouth as it shrinks.'}</p>
            <p className="muted small">{cycles} breaths &middot; about {Math.round((cycleLen * cycles) / 1000)} seconds. Sit comfortably and relax your shoulders.</p>
            <button className="btn primary big" onClick={() => { setT(0); setRunning(true) }} autoFocus><Icon name="play" size={16} /> Begin</button>
          </>
        )}
        {running && (
          <>
            <div className="phase-word">{phase.label}</div>
            <div className="phase-count">{secs}</div>
            <div className="breath-dots">{Array.from({ length: cycles }).map((_, i) => <span key={i} className={i < cycle ? 'on' : i === cycle ? 'now' : ''} />)}</div>
            <button className="btn ghost small" onClick={() => setRunning(false)}>Pause</button>
          </>
        )}
        {!running && t > 0 && !finished && (
          <button className="btn" onClick={() => setRunning(true)}>Resume</button>
        )}
        {finished && (
          <>
            <Sola size={72} />
            <h2>Beautiful breathing</h2>
            <p className="muted">Notice how your body feels now. A little slower? A little softer?</p>
            {err && <div className="form-error">{err}</div>}
            <button className="btn primary big" onClick={() => done({})} disabled={busy}>{busy ? 'Saving…' : 'Finish'}</button>
          </>
        )}
      </div>
    </div>
  )
}

const SENSES = [
  { n: 5, verb: 'see', text: 'Look around. Name 5 things you can see.', ph: 'a window, my shoes…' },
  { n: 4, verb: 'feel', text: 'Notice 4 things you can feel or touch.', ph: 'my feet on the floor…' },
  { n: 3, verb: 'hear', text: 'Listen carefully. Name 3 things you can hear.', ph: 'birds, a fan…' },
  { n: 2, verb: 'smell', text: 'Find 2 things you can smell (or like to smell).', ph: 'soap, fresh bread…' },
  { n: 1, verb: 'taste', text: 'Notice 1 thing you can taste, or take a sip of water.', ph: 'toothpaste…' },
]

function Grounding({ activity, onFinish, onReplay }) {
  const [i, setI] = useState(0)
  const [taps, setTaps] = useState(0)
  const { result, err, busy, done } = useComplete(onFinish)
  if (result) return <Done activity={activity} result={result} onReplay={onReplay} />
  if (i >= SENSES.length) {
    return (
      <div className="calm-stage card center">
        <Sola size={80} />
        <h2>You&rsquo;re here, right now</h2>
        <p className="muted">When your mind races, your senses can bring you back to the present moment.</p>
        {err && <div className="form-error">{err}</div>}
        <button className="btn primary big" onClick={() => done({})} disabled={busy}>{busy ? 'Saving…' : 'Finish'}</button>
      </div>
    )
  }
  const s = SENSES[i]
  return (
    <div className="calm-stage card grounding">
      <div className="sense-number">{s.n}</div>
      <div className="sense-body">
        <span className="eyebrow">Things you can {s.verb}</span>
        <h2>{s.text}</h2>
        <div className="sense-dots">
          {Array.from({ length: s.n }).map((_, k) => (
            <button key={k} className={`sense-dot ${k < taps ? 'on' : ''}`} onClick={() => setTaps(Math.max(taps, k + 1))} aria-label={`Noticed ${k + 1}`}>
              {k < taps ? <Icon name="check" size={18} stroke={3} /> : k + 1}
            </button>
          ))}
        </div>
        <p className="muted small">Tap a circle each time you notice something. You can say them out loud or just in your head.</p>
        <button className="btn primary" disabled={taps < s.n} onClick={() => { setI(i + 1); setTaps(0) }}>{taps < s.n ? `${s.n - taps} more to notice` : 'Next sense'} <Icon name="next" size={16} /></button>
      </div>
    </div>
  )
}

const SQUEEZES = [
  { part: 'Hands', text: 'Pretend you’re squeezing juice out of a lemon in each hand. Squeeze hard!', release: 'Drop the lemons. Let your hands go floppy.' },
  { part: 'Shoulders', text: 'Be a turtle! Pull your shoulders up to your ears and hide in your shell.', release: 'Come out of your shell. Let your shoulders drop down.' },
  { part: 'Face', text: 'A fly landed on your nose! Scrunch up your whole face to shoo it away.', release: 'The fly is gone. Let your face be smooth and soft.' },
  { part: 'Tummy', text: 'An elephant is about to step on your tummy. Make it hard and strong!', release: 'The elephant walked away. Let your tummy relax.' },
  { part: 'Feet', text: 'Squish your toes deep into thick, gooey mud.', release: 'Step out of the mud. Let your feet rest.' },
]

function Squeeze({ activity, onFinish, onReplay }) {
  const [i, setI] = useState(-1)
  const [phase, setPhase] = useState('squeeze')
  const [left, setLeft] = useState(5)
  const { result, err, busy, done } = useComplete(onFinish)
  const timer = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    if (i < 0 || i >= SQUEEZES.length) return
    timer.current = setInterval(() => setLeft(l => l - 1), 1000)
    return () => clearInterval(timer.current)
  }, [i, phase])

  useEffect(() => {
    if (left > 0) return
    clearInterval(timer.current)
    if (phase === 'squeeze') { setPhase('release'); setLeft(6) }
    else { setPhase('squeeze'); setLeft(5); setI(x => x + 1) }
  }, [left, phase])

  if (result) return <Done activity={activity} result={result} onReplay={onReplay} />
  if (i === -1) {
    return (
      <div className="calm-stage card center">
        <Sola size={80} />
        <h2>Squeeze &amp; Release</h2>
        <p className="lead">When we&rsquo;re stressed, our muscles get tight without us noticing. Squeezing them on purpose, then letting go, helps them relax.</p>
        <button className="btn primary big" onClick={() => setI(0)} autoFocus><Icon name="play" size={16} /> Begin</button>
      </div>
    )
  }
  if (i >= SQUEEZES.length) {
    return (
      <div className="calm-stage card center">
        <Character look={user.avatar || DEFAULT_AVATAR} emotion="calm" size={120} />
        <h2>Floppy as a noodle</h2>
        <p className="muted">Your whole body has had a squeeze and a rest. Notice how loose you feel.</p>
        {err && <div className="form-error">{err}</div>}
        <button className="btn primary big" onClick={() => done({})} disabled={busy}>{busy ? 'Saving…' : 'Finish'}</button>
      </div>
    )
  }
  const s = SQUEEZES[i]
  return (
    <div className={`calm-stage card squeeze ${phase}`}>
      <div className="squeeze-avatar">
        <Character look={user.avatar || DEFAULT_AVATAR} emotion={phase === 'squeeze' ? 'frustrated' : 'calm'} size={150} />
      </div>
      <div>
        <span className="eyebrow">{s.part} &middot; {i + 1} of {SQUEEZES.length}</span>
        <h2>{phase === 'squeeze' ? 'Squeeze!' : 'And release…'}</h2>
        <p className="lead">{phase === 'squeeze' ? s.text : s.release}</p>
        <div className="phase-count">{left}</div>
      </div>
    </div>
  )
}

const MOODS = [
  { id: 'happy', e: 'happy', label: 'Happy' },
  { id: 'calm', e: 'calm', label: 'Calm' },
  { id: 'excited', e: 'surprised', label: 'Excited' },
  { id: 'tired', e: 'neutral', label: 'Tired' },
  { id: 'worried', e: 'worried', label: 'Worried' },
  { id: 'sad', e: 'sad', label: 'Sad' },
  { id: 'angry', e: 'angry', label: 'Angry' },
  { id: 'scared', e: 'scared', label: 'Scared' },
  { id: 'frustrated', e: 'frustrated', label: 'Frustrated' },
  { id: 'lonely', e: 'sad', label: 'Lonely' },
]

const MOOD_TIPS = {
  happy: 'Lovely! Notice what made you feel this way. Maybe you can share it with someone.',
  calm: 'Calm is a great place to be. Remember this feeling for when things get busy.',
  excited: 'Excitement is wonderful energy! If it gets too fizzy, a few slow breaths can help.',
  tired: 'Being tired makes every feeling bigger. A drink of water, a stretch, or some rest can help.',
  worried: 'Worries feel smaller when we share them. Try talking to someone you trust, or try Box Breathing.',
  sad: 'It’s okay to feel sad. Be gentle with yourself, and think about who could give you a hug or a listen.',
  angry: 'Anger is a normal feeling. Before you act, try Balloon Breathing to let your thinking brain catch up.',
  scared: 'Feeling scared is your body trying to protect you. If something is wrong, tell a trusted adult.',
  frustrated: 'Frustration often means you care. Take a short break, then try again, or ask for help.',
  lonely: 'Feeling lonely is hard. Could you say hi to someone, or tell a teacher how you feel?',
}

function CheckIn({ activity, onFinish, onReplay }) {
  const { user } = useAuth()
  const { notify } = useGame()
  const [mood, setMood] = useState(null)
  const [intensity, setIntensity] = useState(3)
  const [note, setNote] = useState('')
  const [shared, setShared] = useState(false)
  const [saved, setSaved] = useState(false)
  const { result, err, busy, done } = useComplete(onFinish)
  const [e2, setE2] = useState('')

  async function submit() {
    setE2('')
    try {
      await api('/calm/checkin', { method: 'POST', body: { mood, intensity, note, shared } })
      setSaved(true)
      await done({})
    } catch (e) {
      setE2(e.message)
      notify(e.message, 'warn')
    }
  }

  if (result) {
    return (
      <div className="stack">
        <div className="card checkin-done">
          <Character look={user.avatar} emotion={MOODS.find(m => m.id === mood)?.e || 'calm'} size={110} />
          <div>
            <h2>Thanks for checking in</h2>
            <p className="lead">{MOOD_TIPS[mood]}</p>
            <p className="private-note"><Icon name={shared ? 'users' : 'eyeoff'} size={14} /> {shared ? 'Your teacher will see this check-in.' : 'This check-in is private to you.'}</p>
          </div>
        </div>
        <Done activity={activity} result={result} onReplay={onReplay} />
      </div>
    )
  }

  return (
    <div className="card checkin">
      <h2>How are you feeling right now?</h2>
      <div className="mood-grid">
        {MOODS.map(m => (
          <button key={m.id} className={`mood ${mood === m.id ? 'on' : ''}`} onClick={() => setMood(m.id)} aria-pressed={mood === m.id}>
            <Character look={user.avatar} emotion={m.e} size={78} />
            <span>{m.label}</span>
          </button>
        ))}
      </div>
      {mood && (
        <div className="checkin-more fade-up">
          <div className="field">
            <span className="field-label">How big is the feeling?</span>
            <div className="thermo">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} className={`thermo-step ${intensity >= n ? 'on' : ''}`} style={{ '--n': n }} onClick={() => setIntensity(n)} aria-label={`Size ${n} of 5`}>{n}</button>
              ))}
              <span className="small muted">{['', 'Tiny', 'Small', 'Medium', 'Big', 'Huge'][intensity]}</span>
            </div>
          </div>
          <label className="field">
            <span className="field-label">Want to say more? (optional)</span>
            <textarea rows={2} value={note} onChange={e => setNote(e.target.value)} maxLength={500} placeholder="What happened? What would help?" />
          </label>
          <label className="toggle">
            <input type="checkbox" checked={shared} onChange={e => setShared(e.target.checked)} />
            <span className="toggle-ui" />
            <span>Let my teacher see this check-in</span>
          </label>
          <p className="private-note"><Icon name="eyeoff" size={14} /> If you leave this off, only you can see it.</p>
          {(err || e2) && <div className="form-error">{err || e2}</div>}
          <button className="btn primary big" onClick={submit} disabled={busy || saved}>{busy ? 'Saving…' : 'Check in'}</button>
        </div>
      )}
      {(mood === 'scared' || (mood === 'sad' && intensity >= 4)) && (
        <GuideNote title="You don&rsquo;t have to handle big feelings alone" tone="mid" mood="think">
          If someone is hurting you or you feel unsafe, please tell a trusted adult like a teacher, parent or school counsellor.
        </GuideNote>
      )}
    </div>
  )
}

const PROMPTS = [
  'What is one thing that went well today?',
  'Was anything hard today? How did you handle it?',
  'What is one kind thing you did, or saw someone do?',
  'Is there something you’re looking forward to?',
  'If your feelings today were weather, what weather would they be?',
]

function Reflect({ activity, onFinish, onReplay }) {
  const [p, setP] = useState(() => Math.floor(Math.random() * PROMPTS.length))
  const [text, setText] = useState('')
  const { result, err, busy, done } = useComplete(onFinish)
  if (result) return <Done activity={activity} result={result} onReplay={onReplay} />
  return (
    <div className="card reflect-corner">
      <div className="reflect-head">
        <Sola size={70} mood="think" />
        <div>
          <span className="eyebrow">Reflection Corner</span>
          <h2>{PROMPTS[p]}</h2>
          <button className="link small" onClick={() => setP((p + 1) % PROMPTS.length)}>Try a different question</button>
        </div>
      </div>
      <textarea className="journal-area" rows={6} value={text} onChange={e => setText(e.target.value)} maxLength={2000} placeholder="Write as much or as little as you like…" />
      <p className="private-note"><Icon name="eyeoff" size={14} /> Your journal is private. Not even your teacher can read it.</p>
      {err && <div className="form-error">{err}</div>}
      <button className="btn primary big" disabled={busy || text.trim().length < 8} onClick={() => done({ reflection: { prompt: PROMPTS[p], text } })}>
        {text.trim().length < 8 ? 'Write a few words to save' : busy ? 'Saving…' : 'Save to my journal'}
      </button>
    </div>
  )
}

export default function Calm(props) {
  switch (props.activity.id) {
    case 'calm-balloon':
      return <Breathing {...props} cycles={5} pattern={[{ k: 'in', s: 4, label: 'Breathe in…' }, { k: 'hold-top', s: 1, label: 'Hold' }, { k: 'out', s: 5, label: 'Breathe out…' }]} />
    case 'calm-box':
      return <Breathing {...props} cycles={4} pattern={[{ k: 'in', s: 4, label: 'Breathe in' }, { k: 'hold-top', s: 4, label: 'Hold' }, { k: 'out', s: 4, label: 'Breathe out' }, { k: 'hold-bottom', s: 4, label: 'Hold' }]} />
    case 'calm-grounding':
      return <Grounding {...props} />
    case 'calm-squeeze':
      return <Squeeze {...props} />
    case 'calm-checkin':
      return <CheckIn {...props} />
    case 'calm-reflect':
      return <Reflect {...props} />
    default:
      return <div className="card">Coming soon.</div>
  }
}
