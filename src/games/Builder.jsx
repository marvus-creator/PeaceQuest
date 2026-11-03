import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../state.jsx'
import Character from '../components/Character.jsx'
import Icon from '../components/Icons.jsx'
import { GuideNote, Sola } from '../components/Guide.jsx'
import { XPSummary } from '../components/Rewards.jsx'
import { QUALITY } from './StoryPlayer.jsx'
import { castMember } from '../../shared/cast.js'

export default function Builder({ activity, onFinish, onReplay }) {
  const { user } = useAuth()
  const rounds = activity.rounds
  const [r, setR] = useState(-1)
  const [slot, setSlot] = useState(0)
  const [firstPicks, setFirstPicks] = useState([])
  const [current, setCurrent] = useState([])
  const [roundFirst, setRoundFirst] = useState([])
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  if (r === -1) {
    return (
      <div className="card builder-intro">
        <Sola size={88} />
        <div>
          <h2>{activity.title}</h2>
          <p className="lead">{activity.intro}</p>
          <p className="muted small">Pick a piece for each part of the message. Sola will tell you how each piece might land. You can always swap a piece.</p>
          <button className="btn primary big" onClick={() => setR(0)} autoFocus>Let&rsquo;s build <Icon name="next" size={16} /></button>
        </div>
      </div>
    )
  }

  if (r >= rounds.length) {
    return result ? (
      <div className="result card">
        <XPSummary result={result} />
        <div className="result-side">
          <p className="small muted">Try using one of these messages for real this week. Notice how people react.</p>
          <div className="stack-s">
            <button className="btn primary" onClick={onReplay}><Icon name="rewind" size={16} /> Build again</button>
            <Link className="btn" to="/play/region/communication">Back to Lantern Tower</Link>
          </div>
        </div>
      </div>
    ) : (
      <div className="card center narrow">
        <Sola size={90} />
        <h2>All messages built!</h2>
        <p className="muted">You practised turning big feelings into clear, kind words.</p>
        {err && <div className="form-error">{err}</div>}
        <button className="btn primary big" disabled={busy} onClick={async () => {
          setBusy(true); setErr('')
          try { setResult(await onFinish({ picks: firstPicks })) } catch (e) { setErr(e.message) } finally { setBusy(false) }
        }}>{busy ? 'Saving…' : 'Collect XP'}</button>
      </div>
    )
  }

  const round = rounds[r]
  const s = round.slots[slot]
  const chosen = current[slot]
  const opt = chosen != null ? s.options[chosen] : null
  const roundDone = current.length === round.slots.length && current.every(x => x != null) && slot === round.slots.length - 1 && opt
  const allHelpful = current.every((x, k) => round.slots[k].options[x]?.q === 'helpful')
  const other = castMember(round.who)

  function pick(k) {
    const c = [...current]
    c[slot] = k
    setCurrent(c)
    if (roundFirst[slot] == null) {
      const f = [...roundFirst]
      f[slot] = k
      setRoundFirst(f)
    }
  }

  function nextSlot() {
    setSlot(slot + 1)
  }

  function nextRound() {
    setFirstPicks(p => [...p, roundFirst])
    setCurrent([])
    setRoundFirst([])
    setSlot(0)
    setR(r + 1)
  }

  return (
    <div className="builder">
      <div className="case-progress">{rounds.map((_, k) => <span key={k} className={`case-dot ${k < r ? 'past' : k === r ? 'now' : ''}`} />)}</div>
      <div className="card builder-situation">
        <Character look={other} emotion={roundDone ? (allHelpful ? 'happy' : 'neutral') : 'neutral'} size={96} />
        <div>
          <span className="eyebrow">Message {r + 1} of {rounds.length}</span>
          <p className="lead">{round.situation}</p>
        </div>
      </div>

      <div className="message-board">
        <Character look={user.avatar} emotion="calm" size={64} />
        <div className="message-bubble">
          {round.slots.map((sl, k) => (
            <button key={k} type="button" className={`msg-part ${k === slot ? 'active' : ''} ${current[k] != null ? 'filled q-' + sl.options[current[k]].q : ''}`} onClick={() => k <= slot && setSlot(k)} disabled={k > slot}>
              {current[k] != null ? sl.options[current[k]].t : sl.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card slot-card">
        <h3>{s.label}</h3>
        <div className="tiles">
          {s.options.map((o, k) => (
            <button key={k} className={`tile ${chosen === k ? 'on q-' + o.q : ''}`} onClick={() => pick(k)}>{o.t}</button>
          ))}
        </div>
        {opt && (
          <GuideNote title={QUALITY[opt.q].label} mood={QUALITY[opt.q].mood} tone={QUALITY[opt.q].tone}>
            {opt.why} {opt.q !== 'helpful' && 'Want to try a different piece?'}
          </GuideNote>
        )}
        <div className="row gap-s">
          {opt && slot < round.slots.length - 1 && <button className="btn primary" onClick={nextSlot}>Next part <Icon name="next" size={16} /></button>}
          {roundDone && (
            <button className="btn primary" onClick={nextRound}>{r + 1 < rounds.length ? 'Send & next message' : 'Send message'} <Icon name="next" size={16} /></button>
          )}
        </div>
        {roundDone && (
          <p className="reaction-line">
            <b>{other.name}:</b>{' '}
            {allHelpful ? '“Oh… I didn’t realise. Thanks for telling me like that. Let’s sort it out.”' : '“Hmm, some of that felt a bit like blame… but I get that you’re upset.”'}
          </p>
        )}
      </div>
    </div>
  )
}
