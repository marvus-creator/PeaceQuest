import { useState } from 'react'
import { useApi } from './useOverview.js'
import { api } from '../../api.js'
import { useGame } from '../../state.jsx'
import Icon from '../../components/Icons.jsx'
import { Loading, ErrorBox } from '../Misc.jsx'
import { REGIONS } from '../../../shared/progression.js'

export default function Assignments() {
  const { data, error, reload } = useApi('/teacher/assignments')
  const { notify } = useGame()
  const [activityId, setActivityId] = useState('')
  const [note, setNote] = useState('')
  const [due, setDue] = useState('')
  const [busy, setBusy] = useState(false)
  if (error) return <ErrorBox error={error} onRetry={reload} />
  if (!data) return <Loading />

  async function create(e) {
    e.preventDefault()
    setBusy(true)
    try {
      await api('/teacher/assignments', { method: 'POST', body: { activityId, note, due } })
      notify('Mission assigned. Students will see it on their island.', 'good')
      setActivityId(''); setNote(''); setDue('')
      reload()
    } catch (err) {
      notify(err.message, 'warn')
    } finally {
      setBusy(false)
    }
  }

  async function remove(id) {
    await api(`/teacher/assignments/${id}`, { method: 'DELETE' })
    reload()
  }

  const groups = REGIONS.map(r => ({ r, items: data.options.filter(o => o.mode === r.id) }))

  return (
    <div>
      <header className="t-head">
        <div>
          <p className="eyebrow">Guide the journey</p>
          <h1>Assignments</h1>
          <p className="muted small">Assigned missions are unlocked for every student, even if they haven&rsquo;t reached that region yet.</p>
        </div>
      </header>
      <form className="card assign-form" onSubmit={create}>
        <label className="field grow">
          <span className="field-label">Mission</span>
          <select value={activityId} onChange={e => setActivityId(e.target.value)} required>
            <option value="">Choose a mission…</option>
            {groups.map(g => g.items.length > 0 && (
              <optgroup key={g.r.id} label={g.r.mode}>
                {g.items.map(o => <option key={o.id} value={o.id}>{o.custom ? `★ ${o.title}` : o.title}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="field grow"><span className="field-label">Message to students</span><input value={note} onChange={e => setNote(e.target.value)} maxLength={200} placeholder="We talked about this today…" /></label>
        <label className="field"><span className="field-label">Due (optional)</span><input type="date" value={due} onChange={e => setDue(e.target.value)} /></label>
        <button className="btn primary" disabled={busy || !activityId}><Icon name="flag" size={16} /> Assign</button>
      </form>

      <div className="assign-list">
        {data.assignments.length === 0 && <div className="card muted center">Nothing assigned yet.</div>}
        {data.assignments.map(a => {
          const r = REGIONS.find(x => x.id === a.mode)
          const pct = a.total ? Math.round((a.done / a.total) * 100) : 0
          return (
            <div key={a.id} className="card assign-row" style={{ '--c': r?.color }}>
              <div className="grow">
                <span className="eyebrow">{r?.mode}{a.due ? ` · due ${new Date(a.due + 'T12:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}` : ''}</span>
                <h3>{a.title}</h3>
                {a.note && <p className="small muted">{a.note}</p>}
              </div>
              <div className="assign-progress">
                <div className="bar"><div style={{ width: `${pct}%`, background: r?.color }} /></div>
                <span className="small"><b>{a.done}</b> of {a.total} students completed</span>
              </div>
              <button className="icon-btn" onClick={() => remove(a.id)} aria-label="Remove assignment" title="Remove"><Icon name="trash" size={18} /></button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
