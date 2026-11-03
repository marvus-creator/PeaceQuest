import { useGame } from '../state.jsx'
import BadgeIcon from '../components/BadgeIcon.jsx'
import { XPBar } from '../components/Rewards.jsx'
import { Loading } from './Misc.jsx'
import { LEVELS, LEVEL_TITLES, REGIONS } from '../../shared/progression.js'

export default function Badges() {
  const { progress } = useGame()
  if (!progress) return <Loading />
  const { badges, level } = progress
  const got = badges.filter(b => b.earned).length
  return (
    <div className="badges-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Trophy room</p>
          <h1>Your badges</h1>
          <p className="muted">{got} of {badges.length} earned. Badges reward thinking, reflecting and exploring, not just &ldquo;right answers&rdquo;.</p>
        </div>
      </header>
      <div className="badge-grid">
        {badges.map((b, i) => (
          <div key={b.id} className={`badge-card ${b.earned ? 'earned' : ''}`} style={{ '--i': i }}>
            <BadgeIcon icon={b.icon} earned={!!b.earned} size={92} />
            <h3>{b.name}</h3>
            <p className="small">{b.desc}</p>
            {b.earned ? <span className="pill good">Earned {new Date(b.earned + 'Z').toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span> : <span className="pill">Not yet</span>}
          </div>
        ))}
      </div>

      <section className="card level-road">
        <div className="card-head"><h2>Level road</h2></div>
        <XPBar level={level} />
        <ol className="levels">
          {LEVELS.map((xp, i) => {
            const n = i + 1
            const unlocks = REGIONS.filter(r => r.unlock === n && n > 1)
            return (
              <li key={n} className={level.level >= n ? 'reached' : ''}>
                <span className="lvl-num">{n}</span>
                <span className="lvl-title">{LEVEL_TITLES[i]}</span>
                <span className="lvl-xp">{xp} XP</span>
                {unlocks.map(r => <span key={r.id} className="pill soft" style={{ '--c': r.color }}>Opens {r.name}</span>)}
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
