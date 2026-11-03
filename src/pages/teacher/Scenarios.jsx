import { Link } from 'react-router-dom'
import { useApi } from './useOverview.js'
import { api } from '../../api.js'
import { useGame } from '../../state.jsx'
import Character from '../../components/Character.jsx'
import Icon from '../../components/Icons.jsx'
import { Loading, ErrorBox } from '../Misc.jsx'
import { CAST } from '../../../shared/cast.js'
import { activitiesFor } from '../../../shared/catalog.js'
import { REGIONS } from '../../../shared/progression.js'

export default function Scenarios() {
  const { data, error, reload } = useApi('/teacher/scenarios')
  const { notify } = useGame()
  if (error) return <ErrorBox error={error} onRetry={reload} />
  if (!data) return <Loading />

  async function toggle(s) {
    await api(`/teacher/scenarios/${s.id}`, { method: 'PUT', body: { active: !s.active } })
    notify(s.active ? 'Hidden from students.' : 'Visible to students in Harmony Bridge.', 'info')
    reload()
  }

  async function remove(s) {
    await api(`/teacher/scenarios/${s.id}`, { method: 'DELETE' })
    notify('Scenario deleted.', 'info')
    reload()
  }

  return (
    <div>
      <header className="t-head">
        <div>
          <p className="eyebrow">Your own content</p>
          <h1>Scenarios</h1>
          <p className="muted small">Write conflict situations from your own classroom. They appear for your students in Harmony Bridge.</p>
        </div>
        <Link to="/teacher/scenarios/new" className="btn primary"><Icon name="plus" size={16} /> New scenario</Link>
      </header>

      {data.scenarios.length === 0 ? (
        <div className="card center narrow">
          <h2>No custom scenarios yet</h2>
          <p className="muted">Create a scenario based on something that happened in your class, written so students can practise.</p>
          <Link to="/teacher/scenarios/new" className="btn primary">Write your first scenario</Link>
        </div>
      ) : (
        <div className="scenario-list">
          {data.scenarios.map(s => (
            <div key={s.id} className={`card scenario-row ${s.active ? '' : 'inactive'}`}>
              <Character look={CAST[s.data.who]} emotion={s.data.emotion} size={64} />
              <div className="grow">
                <h3>{s.data.title}</h3>
                <p className="small muted">{s.data.blurb || s.data.intro.slice(0, 120)}</p>
                <div className="row gap-s wrap small">
                  <span className="pill soft">{s.data.choices.length} choices</span>
                  <span className="pill soft">{s.plays} plays</span>
                  {!s.active && <span className="pill">Hidden</span>}
                </div>
              </div>
              <div className="row gap-s">
                <label className="toggle small">
                  <input type="checkbox" checked={s.active} onChange={() => toggle(s)} />
                  <span className="toggle-ui" />
                  <span className="hide-s">{s.active ? 'Visible' : 'Hidden'}</span>
                </label>
                <Link to={`/teacher/scenarios/${s.id}`} className="icon-btn" aria-label="Edit" title="Edit"><Icon name="edit" size={18} /></Link>
                <button className="icon-btn" onClick={() => remove(s)} aria-label="Delete" title="Delete"><Icon name="trash" size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="card">
        <div className="card-head"><h2>Built-in library</h2><span className="small muted">{REGIONS.reduce((n, r) => n + activitiesFor(r.id).length, 0)} missions</span></div>
        <div className="library">
          {REGIONS.map(r => (
            <div key={r.id} className="library-col">
              <h3 style={{ color: r.color }}>{r.mode}</h3>
              <ul>{activitiesFor(r.id).map(a => <li key={a.id}>{a.title}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
