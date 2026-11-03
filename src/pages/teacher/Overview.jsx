import { Link } from 'react-router-dom'
import { useApi, ago } from './useOverview.js'
import Character from '../../components/Character.jsx'
import Icon from '../../components/Icons.jsx'
import { Loading, ErrorBox } from '../Misc.jsx'
import { SKILLS, REGIONS } from '../../../shared/progression.js'

const Q_COLORS = { helpful: '#6BAF6B', mixed: '#E9A23B', unhelpful: '#F2836B' }

export default function Overview() {
  const { data, error, reload } = useApi('/teacher/overview')
  if (error) return <ErrorBox error={error} onRetry={reload} />
  if (!data) return <Loading />
  const { totals, students, skillTotals, modeTotals, activityStats, week, sharedCheckins } = data
  const maxWeek = Math.max(1, ...week.map(w => w.count))
  const skillMax = Math.max(1, ...Object.values(skillTotals))
  const sortedSkills = Object.entries(skillTotals).sort((a, b) => b[1] - a[1])
  const quiet = students.filter(s => !s.lastActive || Date.now() - new Date(s.lastActive.replace(' ', 'T') + 'Z').getTime() > 5 * 86400000)
  const modeMax = Math.max(1, ...Object.values(modeTotals))
  const stories = activityStats.filter(a => a.firstChoices).slice(0, 4)

  return (
    <div className="t-overview">
      <header className="t-head">
        <div>
          <p className="eyebrow">{data.class.name}</p>
          <h1>Class overview</h1>
        </div>
        <div className="row gap-s">
          <Link to="/teacher/scenarios/new" className="btn"><Icon name="plus" size={16} /> New scenario</Link>
          <Link to="/teacher/assignments" className="btn primary"><Icon name="flag" size={16} /> Assign a mission</Link>
        </div>
      </header>

      {students.length === 0 && (
        <div className="card empty-class">
          <h2>No students yet</h2>
          <p>Share your class code <b className="code-inline">{data.class.code}</b> with students. They go to PeaceQuest, choose <b>Join my class</b>, and type the code.</p>
        </div>
      )}

      <div className="kpis">
        <div className="kpi"><span>Students</span><b>{totals.students}</b><small>{totals.activeThisWeek} active this week</small></div>
        <div className="kpi"><span>Missions played</span><b>{totals.plays}</b><small>all time</small></div>
        <div className="kpi"><span>Average level</span><b>{totals.avgLevel}</b><small>across the class</small></div>
        <div className="kpi"><span>Reflections written</span><b>{totals.reflections}</b><small>content stays private</small></div>
      </div>

      <div className="t-grid">
        <section className="card">
          <div className="card-head"><h2>Activity this week</h2><span className="small muted">missions completed per day</span></div>
          <div className="week-chart">
            {week.map(w => (
              <div key={w.day} className="week-col">
                <span className="week-n">{w.count || ''}</span>
                <div className="week-bar" style={{ height: `${(w.count / maxWeek) * 100}%` }} />
                <span className="week-day">{new Date(w.day + 'T12:00').toLocaleDateString(undefined, { weekday: 'short' })}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-head"><h2>Skills the class is practising</h2></div>
          <ul className="skill-bars">
            {sortedSkills.map(([k, v]) => (
              <li key={k}>
                <span>{SKILLS[k].label}</span>
                <div className="bar"><div style={{ width: `${Math.max(2, (v / skillMax) * 100)}%`, background: SKILLS[k].color }} /></div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <div className="card-head"><h2>Regions played</h2></div>
          <ul className="mode-bars">
            {REGIONS.map(r => (
              <li key={r.id}>
                <span className="dot" style={{ background: r.color }} />
                <span className="mode-name">{r.mode}</span>
                <div className="bar"><div style={{ width: `${((modeTotals[r.id] || 0) / modeMax) * 100}%`, background: r.color }} /></div>
                <b>{modeTotals[r.id] || 0}</b>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <div className="card-head"><h2>Shared check-ins</h2><span className="small muted">only ones students chose to share</span></div>
          {sharedCheckins.length === 0 ? <p className="muted small">No shared check-ins. Students can choose to share a feelings check-in with you from Calm Cove.</p> : (
            <ul className="checkin-list">
              {sharedCheckins.map(c => (
                <li key={c.id} className={c.intensity >= 4 && ['sad', 'scared', 'worried', 'angry', 'lonely'].includes(c.mood) ? 'flag' : ''}>
                  <Link to={`/teacher/students/${c.user_id}`}><b>{c.name}</b></Link>
                  <span className="pill soft">{c.mood} &middot; {c.intensity}/5</span>
                  <span className="small muted">{ago(c.created_at)}</span>
                  {c.note && <p className="small">&ldquo;{c.note}&rdquo;</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {stories.length > 0 && (
        <section className="card">
          <div className="card-head"><h2>How the class responds to conflict</h2><span className="small muted">first choice made in each story, all attempts</span></div>
          <div className="choice-dist-grid">
            {stories.map(s => {
              const total = Math.max(1, s.firstChoices.reduce((a, c) => a + c.count, 0))
              return (
                <div key={s.id} className="choice-dist">
                  <h3>{s.title}</h3>
                  <span className="small muted">{s.players} students &middot; {s.plays} plays</span>
                  {s.firstChoices.map(c => (
                    <div key={c.id} className="dist-row">
                      <div className="dist-label"><span className="q-dot" style={{ background: Q_COLORS[c.q] }} />{c.text}</div>
                      <div className="bar"><div style={{ width: `${(c.count / total) * 100}%`, background: Q_COLORS[c.q] }} /></div>
                      <b>{Math.round((c.count / total) * 100)}%</b>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
          <p className="small muted legend-note"><span className="q-dot" style={{ background: Q_COLORS.helpful }} /> helpful <span className="q-dot" style={{ background: Q_COLORS.mixed }} /> partly helpful <span className="q-dot" style={{ background: Q_COLORS.unhelpful }} /> tricky. A great starting point for a class discussion.</p>
        </section>
      )}

      <div className="t-grid">
        <section className="card">
          <div className="card-head"><h2>Top explorers</h2><Link className="link small" to="/teacher/students">All students</Link></div>
          <ul className="people">
            {[...students].sort((a, b) => b.xp - a.xp).slice(0, 5).map(s => (
              <li key={s.id}>
                <Link to={`/teacher/students/${s.id}`}>
                  <Character look={s.avatar} emotion="happy" size={40} />
                  <span><b>{s.name}</b><small>Level {s.level} &middot; {s.missions} missions</small></span>
                  <span className="pill soft">{s.xp} XP</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="card">
          <div className="card-head"><h2>Might need a nudge</h2><span className="small muted">no activity in 5+ days</span></div>
          {quiet.length === 0 ? <p className="muted small">Everyone has played recently.</p> : (
            <ul className="people">
              {quiet.map(s => (
                <li key={s.id}>
                  <Link to={`/teacher/students/${s.id}`}>
                    <Character look={s.avatar} emotion="neutral" size={40} />
                    <span><b>{s.name}</b><small>Last active: {ago(s.lastActive)}</small></span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
