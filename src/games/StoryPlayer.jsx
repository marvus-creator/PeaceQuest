import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../state.jsx'
import Character from '../components/Character.jsx'
import Scene from '../components/Scene.jsx'
import Icon from '../components/Icons.jsx'
import { GuideNote, Sola } from '../components/Guide.jsx'
import { XPSummary } from '../components/Rewards.jsx'
import Reflection from './Reflection.jsx'
import { castMember } from '../../shared/cast.js'

export const QUALITY = {
  helpful: { label: 'Helpful choice', tone: 'good', mood: 'happy' },
  mixed: { label: 'Partly helpful', tone: 'mid', mood: 'think' },
  unhelpful: { label: 'A tricky choice. Let’s learn from it', tone: 'warm', mood: 'think' },
}

export const TONE = {
  bright: { label: 'A peaceful ending', cls: 'bright' },
  mixed: { label: 'A partly solved ending', cls: 'mixed' },
  stormy: { label: 'A stormy ending. That’s okay, this is how we learn', cls: 'stormy' },
}

function Stage({ node, shown, avatar }) {
  const speakers = []
  const emotions = {}
  node.lines.slice(0, shown).forEach(l => {
    if (l.w !== 'narrator') {
      if (!speakers.includes(l.w)) speakers.push(l.w)
      if (l.e) emotions[l.w] = l.e
    }
  })
  node.lines.forEach(l => { if (l.w !== 'narrator' && l.w !== 'you' && !speakers.includes(l.w)) speakers.push(l.w) })
  const others = speakers.filter(s => s !== 'you')
  const current = node.lines[Math.max(0, shown - 1)]?.w
  return (
    <div className="stage">
      <Scene name={node.scene} />
      <div className="stage-cast">
        <div className={`actor you ${current === 'you' ? 'speaking' : ''}`}>
          <Character look={avatar} emotion={emotions.you || 'neutral'} size={150} />
          <span className="nameplate">You</span>
        </div>
        {others.map(w => {
          const c = castMember(w)
          return (
            <div key={w} className={`actor ${current === w ? 'speaking' : ''}`}>
              <Character look={c} emotion={emotions[w] || 'neutral'} size={150} flip />
              <span className="nameplate">{c.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Line({ l, avatar }) {
  if (l.w === 'narrator') return <p className="line narrator">{l.t}</p>
  const c = castMember(l.w, avatar)
  return (
    <div className={`line speech ${l.w === 'you' ? 'mine' : ''}`}>
      <span className="who">{l.w === 'you' ? 'You (thinking)' : c.name}</span>
      <span>{l.t}</span>
    </div>
  )
}

function ChatBubble({ l, avatar }) {
  if (l.w === 'narrator') return <div className="chat-note">{l.t}</div>
  const mine = l.w === 'you'
  const c = castMember(l.w, avatar)
  return (
    <div className={`chat-row ${mine ? 'mine' : ''}`}>
      <div className="chat-face"><Character look={c} emotion={l.e || 'neutral'} size={44} /></div>
      <div className="chat-bubble">
        {!mine && <span className="who">{c.name}</span>}
        {l.t}
      </div>
    </div>
  )
}

export default function StoryPlayer({ activity, history, onFinish, onReplay }) {
  const { user } = useAuth()
  const avatar = user.avatar
  const chat = activity.layout === 'chat'
  const [nodeId, setNodeId] = useState(activity.start)
  const [trail, setTrail] = useState([])
  const [shown, setShown] = useState(1)
  const [picked, setPicked] = useState(null)
  const [rewinds, setRewinds] = useState(0)
  const [reflection, setReflection] = useState(null)
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const bottom = useRef(null)
  const node = activity.nodes[nodeId]
  const allShown = shown >= node.lines.length
  const endingsTotal = useMemo(() => Object.values(activity.nodes).filter(n => n.end).length, [activity])

  useEffect(() => {
    if (chat && bottom.current) bottom.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [shown, picked, nodeId, chat])

  useEffect(() => {
    if (!chat || allShown) return
    const t = setTimeout(() => setShown(s => s + 1), 900)
    return () => clearTimeout(t)
  }, [chat, shown, allShown])

  function choose(c) {
    setPicked(c)
  }

  function advance() {
    setTrail(t => [...t, { nodeId, choice: picked }])
    setNodeId(picked.next)
    setPicked(null)
    setShown(1)
  }

  function rewind() {
    if (picked) { setPicked(null); setRewinds(r => r + 1); return }
    if (!trail.length) return
    const last = trail[trail.length - 1]
    setTrail(trail.slice(0, -1))
    setNodeId(last.nodeId)
    setShown(activity.nodes[last.nodeId].lines.length)
    setRewinds(r => r + 1)
  }

  async function finish() {
    setBusy(true)
    setErr('')
    try {
      const r = await onFinish({ path: trail.map(t => t.choice.id), rewinds, reflection })
      setResult(r)
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusy(false)
    }
  }

  const transcript = chat
    ? [
        ...trail.flatMap(t => [...activity.nodes[t.nodeId].lines, { w: 'you', e: 'calm', t: t.choice.t, said: true }]),
        ...node.lines.slice(0, shown),
      ]
    : null

  const end = node.end
  const tone = end && TONE[end.tone]
  const isNewEnding = end && history && !history.endings.includes(nodeId)

  return (
    <div className={`story ${chat ? 'chat-mode' : ''}`}>
      {chat ? (
        <div className="chat-frame">
          <div className="chat-head">
            <Character look={castMember(activity.cast[0])} emotion="neutral" size={36} />
            <b>{castMember(activity.cast[0]).name}</b>
            {activity.tip && <span className="chat-tip"><Icon name="bulb" size={14} /> {activity.tip}</span>}
          </div>
          <div className="chat-log" aria-live="polite">
            {transcript.map((l, i) => <ChatBubble key={i} l={l} avatar={avatar} />)}
            {!allShown && <div className="chat-typing"><i /><i /><i /></div>}
            <div ref={bottom} />
          </div>
        </div>
      ) : (
        <>
          <Stage node={node} shown={shown} avatar={avatar} />
          <div className="dialogue card" aria-live="polite">
            {node.lines.slice(0, shown).map((l, i) => <Line key={`${nodeId}-${i}`} l={l} avatar={avatar} />)}
            {!allShown && (
              <button className="btn next-line" onClick={() => setShown(s => s + 1)} autoFocus>
                Next <Icon name="next" size={16} />
              </button>
            )}
          </div>
        </>
      )}

      {allShown && !end && !picked && (
        <div className="choices">
          <div className="choices-head">
            <h2>What do you do?</h2>
            {trail.length > 0 && <button className="btn ghost small" onClick={rewind}><Icon name="rewind" size={16} /> Rewind</button>}
          </div>
          {node.choices.map((c, i) => (
            <button key={c.id} className="choice" onClick={() => choose(c)} style={{ '--i': i }}>
              <span className="choice-key">{String.fromCharCode(65 + i)}</span>
              <span>{c.t}</span>
            </button>
          ))}
        </div>
      )}

      {picked && (
        <div className="insight">
          {!chat && <div className="line speech mine said"><span className="who">You</span><span>{picked.t}</span></div>}
          <GuideNote title={QUALITY[picked.q].label} mood={QUALITY[picked.q].mood} tone={QUALITY[picked.q].tone}>
            {picked.why}
          </GuideNote>
          <div className="row gap-s wrap">
            <button className="btn primary" onClick={advance} autoFocus>See what happens <Icon name="next" size={16} /></button>
            <button className="btn ghost" onClick={rewind}><Icon name="rewind" size={16} /> Choose again</button>
          </div>
        </div>
      )}

      {allShown && end && !result && (
        <div className={`ending card ${tone.cls}`}>
          <div className="ending-head">
            <Sola size={64} mood={end.tone === 'bright' ? 'happy' : 'think'} />
            <div>
              <div className="eyebrow">{tone.label}</div>
              <h2>{end.title}</h2>
              {isNewEnding && <span className="pill gold">New ending discovered!</span>}
            </div>
          </div>
          <div className="ending-grid">
            <div><h4>What happened</h4><p>{end.happened}</p></div>
            {end.feel && <div><h4>How others might feel</h4><p>{end.feel}</p></div>}
            {end.why && <div><h4>Why it went this way</h4><p>{end.why}</p></div>}
            {end.try?.length > 0 && (
              <div>
                <h4>{end.tone === 'bright' ? 'Other ideas that could also work' : 'Things you could try'}</h4>
                <ul className="try-list">{end.try.map((t, i) => <li key={i}>{t}</li>)}</ul>
              </div>
            )}
          </div>
          {end.note && <div className="safety-note"><Icon name="shield" size={18} /> {end.note}</div>}
          <Reflection prompt={end.reflect} value={reflection} onChange={setReflection} />
          {err && <div className="form-error">{err}</div>}
          <div className="row gap-s wrap">
            <button className="btn primary big" onClick={finish} disabled={busy}>{busy ? 'Saving…' : 'Finish & collect XP'}</button>
            <button className="btn ghost" onClick={rewind}><Icon name="rewind" size={16} /> Rewind a choice</button>
          </div>
        </div>
      )}

      {result && (
        <div className="result card">
          <XPSummary result={result} />
          <div className="result-side">
            <div className="endings-found">
              <b>{result.progress.per[activity.id]?.endings.length || 0} / {endingsTotal}</b>
              <span>endings discovered</span>
            </div>
            <p className="small muted">Every ending teaches something different. Try another path to see what changes.</p>
            <div className="stack-s">
              <button className="btn primary" onClick={onReplay}><Icon name="rewind" size={16} /> Explore another path</button>
              <Link className="btn" to={`/play/region/${activity.mode}`}>Back to {activity.custom ? 'Harmony Bridge' : 'the region'}</Link>
              <Link className="btn ghost" to="/play">Island map</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
