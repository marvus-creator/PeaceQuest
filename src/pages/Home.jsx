import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useGame } from '../state.jsx'
import { api } from '../api.js'
import Character from '../components/Character.jsx'
import IslandMap from '../components/IslandMap.jsx'
import BadgeIcon from '../components/BadgeIcon.jsx'
import Icon from '../components/Icons.jsx'
import { XPBar } from '../components/Rewards.jsx'
import { GuideNote } from '../components/Guide.jsx'
import { Loading } from './Misc.jsx'
import { ALL_CONTENT } from '../../shared/catalog.js'
import { SKILLS, REGIONS } from '../../shared/progression.js'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export default function Home() {
  const { user } = useAuth()
  const { progress, setProgress, notify, setCelebration } = useGame()
  const nav = useNavigate()
  const [claiming, setClaiming] = useState(null)
  if (!progress) return <Loading label="Opening the map…" />

  const { level, stats, daily, badges, regions, assignments, per, unlocked, skillXp, recent } = progress
  const earned = badges.filter(b => b.earned).sort((a, b) => (b.earned > a.earned ? 1 : -1))
  const here = recent[0]?.mode || 'calm'
  const pendingAssign = assignments.filter(a => !a.done)
  const order = REGIONS.map(r => r.id)
  const next = ALL_CONTENT.filter(a => a.kind !== 'calm').sort((a, b) => order.indexOf(a.mode) - order.indexOf(b.mode)).find(a => unlocked[a.id] && !per[a.id])
  const maxSkill = Math.max(1, ...Object.values(skillXp))
  const topSkills = Object.entries(skillXp).sort((a, b) => b[1] - a[1])

  async function claim(id) {
    setClaiming(id)
    try {
      const r = await api('/daily/claim', { method: 'POST', body: { challengeId: id } })
      setProgress(r.progress)
      notify(`+${r.xp} XP for today’s challenge!`, 'good')
      if (r.levelUp) setCelebration({ levelUp: r.levelUp, badges: [] })
    } catch (e) {
      notify(e.message, 'warn')
    } finally {
      setClaiming(null)
    }
  }

  function selectRegion(r) {
    if (!r.unlocked) return notify(`${r.name} opens at level ${r.unlock}. Keep exploring to get there!`, 'info')
    nav(`/play/region/${r.id}`)
  }

  return (
    <div className="home">
      <section className="home-hero card">
        <div className="home-avatar">
          <Character look={user.avatar} emotion="happy" size={130} />
        </div>
        <div className="home-hello">
          <p className="eyebrow">{greeting()}</p>
          <h1>{user.name}</h1>
          <XPBar level={level} />
          <div className="mini-stats">
            <div><b>{stats.completedUnique}</b><span>missions</span></div>
            <div><b>{earned.length}</b><span>badges</span></div>
            <div><b>{stats.endingsFound}</b><span>endings found</span></div>
            <div><b>{stats.reflections}</b><span>reflections</span></div>
          </div>
        </div>
        {next && (
          <Link to={`/play/mission/${next.id}`} className="next-up" style={{ '--c': REGIONS.find(r => r.id === next.mode)?.color }}>
            <span className="eyebrow">Up next</span>
            <b>{next.title}</b>
            <span className="muted small">{REGIONS.find(r => r.id === next.mode)?.mode}</span>
            <span className="next-play"><Icon name="play" size={16} /> Play</span>
          </Link>
        )}
      </section>

      {pendingAssign.length > 0 && (
        <section className="assign-strip">
          {pendingAssign.slice(0, 2).map(a => (
            <Link key={a.id} to={`/play/mission/${a.activity_id}`} className="assign-card">
              <Icon name="flag" size={22} />
              <div>
                <div className="eyebrow">From your teacher{a.due ? ` · due ${new Date(a.due + 'T12:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}` : ''}</div>
                <b>{a.title}</b>
                {a.note && <p className="small">{a.note}</p>}
              </div>
              <span className="btn small primary">Start</span>
            </Link>
          ))}
        </section>
      )}

      <div className="home-grid">
        <section className="map-card card">
          <div className="card-head">
            <h2>PeaceQuest Island</h2>
            <span className="muted small">Tap a region to explore</span>
          </div>
          <IslandMap regions={regions} onSelect={selectRegion} avatar={user.avatar} here={here} />
          <div className="region-legend">
            {regions.map(r => (
              <button key={r.id} className={`legend-item ${r.unlocked ? '' : 'locked'}`} onClick={() => selectRegion(r)} style={{ '--c': r.color }}>
                <span className="dot" />
                <span><b>{r.name}</b><small>{r.mode}</small></span>
                {!r.unlocked && <Icon name="lock" size={14} />}
              </button>
            ))}
          </div>
        </section>

        <aside className="home-side">
          <section className="card">
            <div className="card-head"><h2>Today&rsquo;s challenges</h2><Icon name="calendar" size={18} /></div>
            <ul className="daily">
              {daily.map(d => (
                <li key={d.id} className={d.claimed ? 'claimed' : d.done ? 'done' : ''}>
                  <span className="daily-check">{d.done ? <Icon name="check" size={16} stroke={3} /> : null}</span>
                  <span className="daily-text">{d.text}</span>
                  {d.claimed ? <span className="pill soft">+{d.xp}</span> : d.done ? (
                    <button className="btn small gold" onClick={() => claim(d.id)} disabled={claiming === d.id}>Claim {d.xp}</button>
                  ) : <span className="pill">{d.xp} XP</span>}
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <div className="card-head"><h2>Badges</h2><Link to="/play/badges" className="link small">See all</Link></div>
            {earned.length ? (
              <div className="badge-row">
                {earned.slice(0, 4).map(b => (
                  <div key={b.id} className="badge-mini" title={b.desc}>
                    <BadgeIcon icon={b.icon} size={58} />
                    <span>{b.name}</span>
                  </div>
                ))}
              </div>
            ) : <p className="muted small">Finish your first mission to earn the First Step badge.</p>}
          </section>

          <section className="card">
            <div className="card-head"><h2>Skills you&rsquo;re growing</h2></div>
            <ul className="skill-bars">
              {topSkills.slice(0, 6).map(([k, v]) => (
                <li key={k}>
                  <span>{SKILLS[k].label}</span>
                  <div className="bar"><div style={{ width: `${Math.max(4, (v / maxSkill) * 100)}%`, background: SKILLS[k].color }} /></div>
                </li>
              ))}
            </ul>
          </section>

          {stats.completedUnique === 0 && (
            <GuideNote title="Welcome to the island!">
              Start in <b>Calm Cove</b> or <b>Mirror Lake</b>. New regions open as you level up.
            </GuideNote>
          )}
        </aside>
      </div>
    </div>
  )
}
