import { useState } from 'react'
import { Link } from 'react-router-dom'
import Character from '../components/Character.jsx'
import Scene from '../components/Scene.jsx'
import Icon from '../components/Icons.jsx'
import { GuideNote, Sola } from '../components/Guide.jsx'
import { XPSummary } from '../components/Rewards.jsx'
import Reflection from './Reflection.jsx'
import { QUALITY } from './StoryPlayer.jsx'
import { feelLabel } from './Detective.jsx'
import { castMember } from '../../shared/cast.js'

const FAMILIES = [
  { name: 'Bright', color: '#F5C451', list: ['happy', 'proud', 'excited', 'calm', 'hopeful', 'grateful', 'relieved'] },
  { name: 'Heavy', color: '#7EC4E6', list: ['sad', 'lonely', 'disappointed', 'hurt'] },
  { name: 'Hot', color: '#F2836B', list: ['angry', 'frustrated', 'jealous'] },
  { name: 'Shaky', color: '#9C8FD6', list: ['scared', 'worried', 'nervous'] },
  { name: 'Tangled', color: '#E57A9A', list: ['embarrassed', 'ashamed', 'guilty', 'confused', 'surprised'] },
]

function FeelPicker({ step, value, onChange, revealed }) {
  const toggle = f => {
    if (revealed) return
    onChange(value.includes(f) ? value.filter(x => x !== f) : [...value, f])
  }
  return (
    <div className="feel-picker">
      {FAMILIES.map(fam => (
        <div key={fam.name} className="feel-family" style={{ '--f': fam.color }}>
          <span className="feel-family-name">{fam.name}</span>
          <div className="chips">
            {fam.list.map(f => {
              const on = value.includes(f)
              const likely = step.likely.includes(f)
              return (
                <button key={f} type="button" className={`chip feel ${on ? 'on' : ''} ${revealed && likely ? 'likely' : ''}`} onClick={() => toggle(f)} aria-pressed={on}>
                  {feelLabel(f)}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Empathy({ activity, onFinish, onReplay }) {
  const steps = activity.steps
  const [i, setI] = useState(0)
  const [feels, setFeels] = useState({})
  const [revealed, setRevealed] = useState({})
  const [choice, setChoice] = useState(null)
  const [reflection, setReflection] = useState(null)
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const step = steps[i]
  const atEnd = i >= steps.length

  const canNext = () => {
    if (!step) return true
    if (step.type === 'feel') return revealed[step.who]
    if (step.type === 'choice') return choice !== null
    return true
  }

  async function finish() {
    setBusy(true); setErr('')
    try { setResult(await onFinish({ feels, choice, reflection })) } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <div className="empathy">
      <div className="journey-track" aria-label={`Step ${Math.min(i + 1, steps.length + 1)} of ${steps.length + 1}`}>
        {[...steps, { type: 'end' }].map((s, k) => (
          <span key={k} className={`track-step ${k < i ? 'past' : k === i ? 'now' : ''} t-${s.type}`}>
            {s.type === 'perspective' ? <Character look={castMember(s.who)} emotion={s.emotion} size={26} /> : null}
          </span>
        ))}
      </div>

      {!atEnd && step.type === 'scene' && (
        <div className="emp-scene card">
          <div className="emp-banner"><Scene name={step.scene} /></div>
          <div className="emp-text">
            <span className="eyebrow">{step.title}</span>
            {step.text.map((p, k) => <p key={k} style={{ '--d': `${k * 120}ms` }} className="fade-up">{p}</p>)}
          </div>
        </div>
      )}

      {!atEnd && step.type === 'perspective' && (
        <div className="emp-perspective card">
          <div className="persp-portrait">
            <Character look={castMember(step.who)} emotion={step.emotion} size={200} />
          </div>
          <div className="persp-words">
            <span className="eyebrow">Through {castMember(step.who).name}&rsquo;s eyes</span>
            <h2>{step.title}</h2>
            {step.text.map((p, k) => <p key={k} className="quote fade-up" style={{ '--d': `${k * 140}ms` }}>{p}</p>)}
          </div>
        </div>
      )}

      {!atEnd && step.type === 'feel' && (
        <div className="emp-feel card">
          <div className="feel-head">
            <Character look={castMember(step.who)} emotion="neutral" size={84} />
            <div>
              <h2>{step.prompt}</h2>
              <p className="muted small">There&rsquo;s no single right answer. People can feel many things at once.</p>
            </div>
          </div>
          <FeelPicker step={step} value={feels[step.who] || []} onChange={v => setFeels(f => ({ ...f, [step.who]: v }))} revealed={revealed[step.who]} />
          {!revealed[step.who] ? (
            <button className="btn primary" disabled={!(feels[step.who] || []).length} onClick={() => setRevealed(r => ({ ...r, [step.who]: true }))}>
              {(feels[step.who] || []).length ? 'See what others might notice' : 'Pick at least one feeling'}
            </button>
          ) : (
            <GuideNote title="What others might notice" tone="good">
              {step.insight}{' '}
              {(() => {
                const mine = feels[step.who] || []
                const match = mine.filter(f => step.likely.includes(f))
                const extra = mine.filter(f => !step.likely.includes(f))
                return (
                  <>
                    {match.length > 0 && <span>You noticed {match.map(feelLabel).join(', ')}. Lots of people would agree. </span>}
                    {extra.length > 0 && <span>{extra.map(feelLabel).join(', ')} {extra.length > 1 ? 'are' : 'is'} a thoughtful guess too. Everyone imagines a little differently. </span>}
                    <span>Highlighted feelings are ones many people would pick.</span>
                  </>
                )
              })()}
            </GuideNote>
          )}
        </div>
      )}

      {!atEnd && step.type === 'choice' && (
        <div className="emp-choice">
          <h2>{step.prompt}</h2>
          <div className="choices">
            {step.options.map((o, k) => (
              <button key={k} className={`choice ${choice === k ? 'selected' : ''}`} onClick={() => setChoice(k)} style={{ '--i': k }}>
                <span className="choice-key">{String.fromCharCode(65 + k)}</span>
                <span>{o.t}</span>
              </button>
            ))}
          </div>
          {choice !== null && (
            <GuideNote title={QUALITY[step.options[choice].q].label} mood={QUALITY[step.options[choice].q].mood} tone={QUALITY[step.options[choice].q].tone}>
              {step.options[choice].why} {step.options[choice].q !== 'helpful' && 'You can tap another option to explore it.'}
            </GuideNote>
          )}
        </div>
      )}

      {!atEnd && step.type === 'insight' && (
        <div className="emp-insight card">
          <Sola size={96} />
          <div>
            <span className="eyebrow">The big idea</span>
            <p className="lead">{step.text}</p>
          </div>
        </div>
      )}

      {atEnd && !result && (
        <div className="card">
          <h2>Journey complete</h2>
          <p className="muted">You heard both sides of the story. That&rsquo;s what empathy is all about.</p>
          <Reflection prompt={activity.reflect} value={reflection} onChange={setReflection} />
          {err && <div className="form-error">{err}</div>}
          <button className="btn primary big" onClick={finish} disabled={busy}>{busy ? 'Saving…' : 'Finish & collect XP'}</button>
        </div>
      )}

      {result && (
        <div className="result card">
          <XPSummary result={result} />
          <div className="result-side">
            <p className="small muted">Try noticing both sides the next time you see a disagreement in real life.</p>
            <div className="stack-s">
              <button className="btn primary" onClick={onReplay}><Icon name="rewind" size={16} /> Walk the journey again</button>
              <Link className="btn" to="/play/region/empathy">Back to Echo Valley</Link>
            </div>
          </div>
        </div>
      )}

      {!atEnd && (
        <div className="step-nav">
          <button className="btn ghost" onClick={() => setI(i - 1)} disabled={i === 0}><Icon name="back" size={16} /> Back</button>
          <button className="btn primary" onClick={() => setI(i + 1)} disabled={!canNext()}>{i + 1 === steps.length ? 'Finish journey' : 'Continue'} <Icon name="next" size={16} /></button>
        </div>
      )}
    </div>
  )
}
