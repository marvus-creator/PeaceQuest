import { useState } from 'react'
import { Link } from 'react-router-dom'
import Character from '../components/Character.jsx'
import Icon from '../components/Icons.jsx'
import { GuideNote, Sola } from '../components/Guide.jsx'
import { XPSummary } from '../components/Rewards.jsx'
import { castMember } from '../../shared/cast.js'

export const feelLabel = f => f.charAt(0).toUpperCase() + f.slice(1)

export default function Detective({ activity, onFinish, onReplay }) {
  const cases = activity.cases
  const [i, setI] = useState(-1)
  const [answers, setAnswers] = useState([])
  const [first, setFirst] = useState(null)
  const [second, setSecond] = useState(null)
  const [clues, setClues] = useState(false)
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  if (i === -1) {
    return (
      <div className="detective-intro card">
        <div className="detective-badge"><Sola size={88} /></div>
        <div>
          <h2>Welcome, Detective!</h2>
          <p>{activity.blurb}</p>
          <ul className="tips">
            <li><Icon name="sparkle" size={16} /> Look closely at faces, bodies and what&rsquo;s happening.</li>
            <li><Icon name="bulb" size={16} /> Stuck? Use the magnifier for clues. It&rsquo;s free!</li>
            <li><Icon name="heart" size={16} /> Some cases have more than one good answer, because people can feel two things at once.</li>
          </ul>
          <button className="btn primary big" onClick={() => setI(0)} autoFocus>Open case file <Icon name="next" size={16} /></button>
        </div>
      </div>
    )
  }

  if (i >= cases.length) {
    const firstRight = answers.filter((a, k) => cases[k].answer.includes(a.first)).length
    return (
      <div className="detective-end">
        {!result ? (
          <div className="card center narrow">
            <Sola size={90} />
            <h2>Case file complete!</h2>
            <p className="lead">You spotted <b>{firstRight}</b> of {cases.length} feelings on your first look{firstRight < cases.length ? ', and worked out the rest by looking again' : ''}.</p>
            <div className="case-recap">
              {answers.map((a, k) => {
                const ok = cases[k].answer.includes(a.first)
                return <span key={k} className={`recap-dot ${ok ? 'good' : 'mid'}`} title={`Case ${k + 1}`}>{ok ? <Icon name="check" size={14} stroke={3} /> : k + 1}</span>
              })}
            </div>
            {err && <div className="form-error">{err}</div>}
            <button className="btn primary big" disabled={busy} onClick={async () => {
              setBusy(true); setErr('')
              try { setResult(await onFinish({ answers })) } catch (e) { setErr(e.message) } finally { setBusy(false) }
            }}>{busy ? 'Saving…' : 'Close the case & collect XP'}</button>
          </div>
        ) : (
          <div className="result card">
            <XPSummary result={result} />
            <div className="result-side">
              <p className="small muted">Reading feelings gets easier with practice. Real people are trickier than drawings, so it&rsquo;s always okay to ask, &ldquo;How are you feeling?&rdquo;</p>
              <div className="stack-s">
                <button className="btn primary" onClick={onReplay}><Icon name="rewind" size={16} /> Play again</button>
                <Link className="btn" to="/play/region/detective">Back to Mirror Lake</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const c = cases[i]
  const who = castMember(c.who)
  const done = (first && c.answer.includes(first)) || second
  const solvedRight = first && (c.answer.includes(first) || c.answer.includes(second))

  function pick(opt) {
    if (done) return
    if (!first) setFirst(opt)
    else setSecond(opt)
  }

  function nextCase() {
    setAnswers(a => [...a, { first, second }])
    setFirst(null)
    setSecond(null)
    setClues(false)
    setI(i + 1)
  }

  return (
    <div className="detective">
      <div className="case-progress" aria-label={`Case ${i + 1} of ${cases.length}`}>
        {cases.map((_, k) => <span key={k} className={`case-dot ${k < i ? 'past' : k === i ? 'now' : ''}`} />)}
      </div>
      <div className="case card">
        <div className={`case-art ${c.type}`}>
          {c.type === 'story' ? (
            <div className="story-clue">
              <Character look={who} emotion="neutral" size={110} />
              <blockquote>{c.text}</blockquote>
            </div>
          ) : (
            <div className={`evidence ${clues ? 'zoom' : ''}`}>
              <Character look={who} emotion={c.emotion} pose={c.type === 'body' ? c.pose : null} size={c.type === 'body' ? 190 : 230} />
              {clues && <div className="lens" aria-hidden="true" />}
            </div>
          )}
          <span className="case-tag">Case {i + 1}</span>
        </div>
        <div className="case-body">
          <h2>{c.prompt}</h2>
          <div className="answer-grid">
            {c.options.map(o => {
              const isFirst = first === o
              const isSecond = second === o
              const right = c.answer.includes(o)
              let cls = ''
              if (isFirst || isSecond) cls = right ? 'right' : 'wrong'
              if (done && right && !isFirst && !isSecond) cls = 'reveal'
              return (
                <button key={o} className={`answer ${cls}`} onClick={() => pick(o)} disabled={done || isFirst}>
                  {feelLabel(o)}
                </button>
              )
            })}
          </div>
          {c.clues && !done && (
            <button className="btn ghost small" onClick={() => setClues(true)} disabled={clues}>
              <Icon name="sparkle" size={16} /> {clues ? 'Magnifier on' : 'Use the magnifier'}
            </button>
          )}
          {clues && !done && c.clues && (
            <ul className="clue-list">{c.clues.map((k, n) => <li key={n}><Icon name="bulb" size={14} /> {k}</li>)}</ul>
          )}
          {first && !done && (
            <GuideNote title="Look again!" mood="think" tone="mid">
              {c.type === 'story' ? 'Read the story again. What is happening, and what does the person do?' : `Not quite. ${c.clues?.[0] || 'Look closely at the face.'} You get one more look.`}
            </GuideNote>
          )}
          {done && (
            <div className="case-explain">
              <GuideNote title={solvedRight ? (c.answer.includes(first) ? 'Great detective work!' : 'You worked it out!') : 'Here’s the answer'} mood={solvedRight ? 'happy' : 'think'} tone={solvedRight ? 'good' : 'mid'}>
                {c.explain}
                {c.answer.length > 1 && <span className="also"> Good answers here: {c.answer.map(feelLabel).join(', ')}.</span>}
              </GuideNote>
              <button className="btn primary" onClick={nextCase} autoFocus>{i + 1 < cases.length ? 'Next case' : 'Finish case file'} <Icon name="next" size={16} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
