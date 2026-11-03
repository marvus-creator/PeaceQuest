import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi, ago } from './useOverview.js'
import Character from '../../components/Character.jsx'
import { Loading, ErrorBox } from '../Misc.jsx'
import { REGIONS } from '../../../shared/progression.js'

export default function Students() {
  const { data, error, reload } = useApi('/teacher/overview')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('name')
  if (error) return <ErrorBox error={error} onRetry={reload} />
  if (!data) return <Loading />
  const list = data.students
    .filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.username.includes(q.toLowerCase()))
    .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'xp' ? b.xp - a.xp : (b.lastActive || '').localeCompare(a.lastActive || ''))
  return (
    <div>
      <header className="t-head">
        <div>
          <p className="eyebrow">{data.class.name}</p>
          <h1>Students</h1>
          <p className="muted small">Students join with class code <b className="code-inline">{data.class.code}</b></p>
        </div>
        <div className="row gap-s">
          <input className="search" placeholder="Search students" value={q} onChange={e => setQ(e.target.value)} aria-label="Search students" />
          <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort students">
            <option value="name">Sort: Name</option>
            <option value="xp">Sort: XP</option>
            <option value="active">Sort: Recently active</option>
          </select>
        </div>
      </header>
      <div className="card table-card">
        <table className="t-table">
          <thead>
            <tr><th>Student</th><th>Level</th><th>Missions</th><th className="hide-s">Regions explored</th><th className="hide-s">Badges</th><th>Last active</th></tr>
          </thead>
          <tbody>
            {list.map(s => (
              <tr key={s.id}>
                <td>
                  <Link to={`/teacher/students/${s.id}`} className="person">
                    <Character look={s.avatar} emotion="happy" size={36} />
                    <span><b>{s.name}</b><small>@{s.username}</small></span>
                  </Link>
                </td>
                <td><span className="pill soft">Lv {s.level}</span> <small className="muted">{s.xp} XP</small></td>
                <td>{s.missions}</td>
                <td className="hide-s">
                  <div className="region-dots">
                    {REGIONS.map(r => <span key={r.id} title={`${r.mode}: ${s.byMode[r.id] || 0}`} style={{ background: s.byMode[r.id] ? r.color : '#E7E3DA' }} />)}
                  </div>
                </td>
                <td className="hide-s">{s.badges}</td>
                <td className="small">{ago(s.lastActive)}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={6} className="muted center">No students match.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
