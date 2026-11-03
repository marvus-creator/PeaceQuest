import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApi, ago } from './useOverview.js'
import { api } from '../../api.js'
import { useGame } from '../../state.jsx'
import Character from '../../components/Character.jsx'
import BadgeIcon from '../../components/BadgeIcon.jsx'
import Icon from '../../components/Icons.jsx'
import { Loading, ErrorBox } from '../Misc.jsx'
import { SKILLS, REGIONS, BADGES, levelInfo } from '../../../shared/progression.js'

const TONE = { bright: 'Peaceful ending', mixed: 'Partly solved', stormy: 'Stormy ending' }

export default function StudentDetail() {
  const { id } = useParams()
  const { data, error, reload } = useApi(`/teacher/students/${id}`)
  const { notify } = useGame()
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  if (error) return <ErrorBox error={error} onRetry={reload} />
  if (!data) return <Loading />
  const { student: s, history, badges, sharedCheckins, privateCheckins } = data
  const lvl = levelInfo(s.xp)
  const skillMax = Math.max(1, ...Object.values(s.skillXp))
  const badgeMap = Object.fromEntries(BADGES.map(b => [b.id, b]))

  async function resetPw(e) {
    e.preventDefault()
    try {
      await api(`/teacher/students/${s.id}/password`, { method: 'POST', body: { password: pw } })
      notify(`Password updated for ${s.name}.`, 'good')
      setPw(''); setShowPw(false)
    } catch (err) {
      notify(err.message, 'warn')
    }
  }

  return (
    <div className="t-student">
      <Link to="/teacher/students" className="back-link"><Icon name="back" size={18} /> Students</Link>
      <header className="card student-head">
        <Character look={s.avatar} emotion="happy" size={110} />
        <div className="grow">
          <h1>{s.name}</h1>
          <p className="muted">@{s.username} &middot; last active {ago(s.lastActive)}</p>
          <div className="mini-stats">
            <div><b>{lvl.level}</b><span>{lvl.title}</span></div>
            <div><b>{s.xp}</b><span>XP</span></div>
            <div><b>{s.missions}</b><span>missions</span></div>
            <div><b>{s.badges}</b><span>badges</span></div>
            <div><b>{s.reflections}</b><span>reflections</span></div>
          </div>
        </div>
        <div className="student-actions">
          {showPw ? (
            <form onSubmit={resetPw} className="row gap-s">
              <input type="text" value={pw} onChange={e => setPw(e.target.value)} placeholder="New password" aria-label="New password" minLength={6} required />
              <button className="btn small primary">Save</button>
              <button type="button" className="btn small ghost" onClick={() => setShowPw(false)}>Cancel</button>
            </form>
          ) : <button className="btn small" onClick={() => setShowPw(true)}>Reset password</button>}
        </div>
      </header>

      <div className="t-grid">
        <section className="card">
          <div className="card-head"><h2>Skills practised</h2></div>
          <ul className="skill-bars">
            {Object.entries(s.skillXp).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
              <li key={k}><span>{SKILLS[k].label}</span><div className="bar"><div style={{ width: `${Math.max(2, (v / skillMax) * 100)}%`, background: SKILLS[k].color }} /></div></li>
            ))}
          </ul>
        </section>
        <section className="card">
          <div className="card-head"><h2>Regions</h2></div>
          <ul className="mode-bars">
            {REGIONS.map(r => (
              <li key={r.id}><span className="dot" style={{ background: r.color }} /><span className="mode-name">{r.mode}</span><b>{s.byMode[r.id] || 0}</b></li>
            ))}
          </ul>
          <div className="badge-row">
            {badges.map(b => badgeMap[b.badge_id] && (
              <div key={b.badge_id} className="badge-mini" title={badgeMap[b.badge_id].desc}><BadgeIcon icon={badgeMap[b.badge_id].icon} size={48} /><span>{badgeMap[b.badge_id].name}</span></div>
            ))}
          </div>
        </section>
      </div>

      <div className="t-grid">
        <section className="card">
          <div className="card-head"><h2>Completed missions</h2></div>
          {history.length === 0 ? <p className="muted small">No missions yet.</p> : (
            <ul className="history">
              {history.map((h, i) => {
                const r = REGIONS.find(x => x.id === h.mode)
                return (
                  <li key={i}>
                    <span className="dot" style={{ background: r?.color }} />
                    <span className="grow"><b>{h.title}</b><small>{r?.mode}{h.tone ? ` · ${TONE[h.tone]}` : ''}</small></span>
                    <span className="small muted">{ago(h.created_at)}</span>
                    <span className="pill soft">+{h.xp}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
        <section className="card">
          <div className="card-head"><h2>Wellbeing</h2></div>
          <div className="privacy-box">
            <Icon name="shield" size={20} />
            <p className="small">Reflections are private to {s.name}: you can see that {s.reflections} were written, but not what they say. Feelings check-ins only appear here if {s.name} chose to share them.{privateCheckins > 0 ? ` (${privateCheckins} private check-in${privateCheckins > 1 ? 's' : ''} hidden.)` : ''}</p>
          </div>
          {sharedCheckins.length === 0 ? <p className="muted small">No shared check-ins.</p> : (
            <ul className="checkin-list">
              {sharedCheckins.map((c, i) => (
                <li key={i} className={c.intensity >= 4 ? 'flag' : ''}>
                  <span className="pill soft">{c.mood} &middot; {c.intensity}/5</span>
                  <span className="small muted">{ago(c.created_at)}</span>
                  {c.note && <p className="small">&ldquo;{c.note}&rdquo;</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
