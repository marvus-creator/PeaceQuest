import { Link, Navigate, useParams } from 'react-router-dom'
import { useGame } from '../state.jsx'
import { activitiesFor, BY_ID } from '../../shared/catalog.js'
import { REGIONS, SKILLS } from '../../shared/progression.js'
import { CAST } from '../../shared/cast.js'
import Character from '../components/Character.jsx'
import Icon from '../components/Icons.jsx'
import { Sola } from '../components/Guide.jsx'
import { Loading } from './Misc.jsx'

const KIND_LABEL = { story: 'Branching story', detective: 'Case file', empathy: 'Two-sided story', builder: 'Word builder', calm: 'Calm activity' }

function endingsCount(a) {
  return a.nodes ? Object.values(a.nodes).filter(n => n.end).length : 0
}

function MissionArt({ a }) {
  const who = a.cast?.[0] || a.cases?.[0]?.who || a.rounds?.[0]?.who || a.steps?.find(s => s.who && s.who !== 'narrator')?.who
  if (a.kind === 'calm') return <div className="mission-art calm-art"><Sola size={64} /></div>
  const emo = a.mode === 'conflict' ? 'frustrated' : a.mode === 'empathy' ? 'sad' : a.mode === 'detective' ? 'surprised' : a.mode === 'communication' ? 'hopeful' : 'happy'
  return <div className="mission-art"><Character look={CAST[who] || CAST.amani} emotion={emo} size={86} /></div>
}

export default function Region() {
  const { id } = useParams()
  const { progress } = useGame()
  const region = REGIONS.find(r => r.id === id)
  if (!region) return <Navigate to="/play" replace />
  if (!progress) return <Loading />
  const reg = progress.regions.find(r => r.id === id)
  const list = [...activitiesFor(id), ...(id === 'conflict' ? progress.custom : [])]
  const done = list.filter(a => progress.per[a.id]).length

  if (!reg.unlocked) {
    return (
      <div className="region-page">
        <Link to="/play" className="back-link"><Icon name="back" size={18} /> Island</Link>
        <div className="card narrow center">
          <Sola size={90} mood="think" />
          <h1>{region.name} is still asleep</h1>
          <p className="muted">Reach <b>level {region.unlock}</b> to wake it up. You&rsquo;re level {progress.level.level} now. Keep playing in the open regions!</p>
          <Link to="/play" className="btn primary">Back to the island</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="region-page" style={{ '--c': region.color }}>
      <Link to="/play" className="back-link"><Icon name="back" size={18} /> Island</Link>
      <header className="region-hero">
        <div>
          <p className="eyebrow">{region.mode}</p>
          <h1>{region.name}</h1>
          <p className="lead">{region.blurb}</p>
        </div>
        <div className="region-progress">
          <div className="ring" style={{ '--p': list.length ? done / list.length : 0 }}><span>{done}/{list.length}</span></div>
          <span className="small muted">completed</span>
        </div>
      </header>

      <div className="mission-grid">
        {list.map((a, i) => {
          const open = progress.unlocked[a.id]
          const hist = progress.per[a.id]
          const total = endingsCount(a)
          const assigned = progress.assignments.some(x => x.activity_id === a.id)
          const full = BY_ID[a.id] || a
          const content = (
            <>
              <MissionArt a={full} />
              <div className="mission-body">
                <div className="mission-tags">
                  <span className="pill soft">{a.custom ? 'From your teacher' : KIND_LABEL[a.kind] || 'Mission'}</span>
                  {assigned && !a.custom && <span className="pill gold">Assigned</span>}
                  {hist && <span className="pill good"><Icon name="check" size={12} stroke={3} /> Done</span>}
                </div>
                <h3>{a.title}</h3>
                <p className="small">{a.blurb}</p>
                <div className="mission-meta">
                  <span><Icon name="clock" size={14} /> {a.minutes} min</span>
                  {total > 0 && <span><Icon name="flag" size={14} /> {hist ? hist.endings.length : 0}/{total} endings</span>}
                  {(a.skills || []).slice(0, 2).map(s => <span key={s} className="skill-tag" style={{ '--s': SKILLS[s]?.color }}>{SKILLS[s]?.label}</span>)}
                </div>
              </div>
              <div className="mission-cta">
                {open ? <span className="btn small primary">{hist ? 'Play again' : 'Play'}</span> : <span className="locked-note"><Icon name="lock" size={16} /> Finish &ldquo;{BY_ID[a.requires]?.title}&rdquo;</span>}
              </div>
            </>
          )
          return open ? (
            <Link key={a.id} to={`/play/mission/${a.id}`} className="mission-card" style={{ '--i': i }}>{content}</Link>
          ) : (
            <div key={a.id} className="mission-card locked" style={{ '--i': i }} aria-disabled="true">{content}</div>
          )
        })}
      </div>
    </div>
  )
}
