import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useGame } from '../state.jsx'
import Icon from '../components/Icons.jsx'
import Character from '../components/Character.jsx'
import { useAuth } from '../state.jsx'
import { Sola } from '../components/Guide.jsx'
import { Loading, ErrorBox } from './Misc.jsx'

const MOOD_E = { happy: 'happy', calm: 'calm', excited: 'surprised', tired: 'neutral', worried: 'worried', sad: 'sad', angry: 'angry', scared: 'scared', frustrated: 'frustrated', lonely: 'sad' }

export default function Journal() {
  const { user } = useAuth()
  const { notify } = useGame()
  const [entries, setEntries] = useState(null)
  const [checkins, setCheckins] = useState([])
  const [error, setError] = useState('')

  const load = () => {
    setError('')
    Promise.all([api('/journal'), api('/checkins')])
      .then(([j, c]) => { setEntries(j.entries); setCheckins(c.checkins) })
      .catch(e => setError(e.message))
  }
  useEffect(load, [])

  async function remove(id) {
    await api(`/journal/${id}`, { method: 'DELETE' })
    setEntries(e => e.filter(x => x.id !== id))
    notify('Entry removed.', 'info')
  }

  if (error) return <ErrorBox error={error} onRetry={load} />
  if (!entries) return <Loading />
  const fmt = d => new Date(d.replace(' ', 'T') + 'Z').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <div className="journal-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Just for you</p>
          <h1>My journal</h1>
          <p className="muted"><Icon name="eyeoff" size={14} /> Your reflections are private. Other students and teachers cannot read them.</p>
        </div>
        <Link to="/play/mission/calm-reflect" className="btn primary"><Icon name="edit" size={16} /> Write something</Link>
      </header>

      {checkins.length > 0 && (
        <section className="card">
          <div className="card-head"><h2>Feelings check-ins</h2><Link to="/play/mission/calm-checkin" className="link small">Check in now</Link></div>
          <div className="checkin-strip">
            {checkins.slice(0, 10).map(c => (
              <div key={c.id} className="checkin-chip" title={c.note || ''}>
                <Character look={user.avatar} emotion={MOOD_E[c.mood] || 'neutral'} size={48} />
                <b>{c.mood}</b>
                <span className="thermo-mini">{'●'.repeat(c.intensity)}{'○'.repeat(5 - c.intensity)}</span>
                <span className="small muted">{fmt(c.created_at)}</span>
                {c.shared ? <span className="pill soft">Shared</span> : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {entries.length === 0 ? (
        <div className="card center narrow">
          <Sola size={80} mood="think" />
          <h2>Your journal is empty</h2>
          <p className="muted">At the end of each story you can answer a reflection question. Your answers are saved here.</p>
        </div>
      ) : (
        <div className="journal-list">
          {entries.map(e => (
            <article key={e.id} className="journal-entry card">
              <div className="journal-meta">
                <span className="pill soft">{e.title}</span>
                <span className="small muted">{fmt(e.created_at)}</span>
                <button className="icon-btn small" onClick={() => remove(e.id)} aria-label="Delete entry" title="Delete entry"><Icon name="trash" size={16} /></button>
              </div>
              {e.prompt && e.prompt !== 'Reflection' && <h3>{e.prompt}</h3>}
              {e.chip && <p className="journal-chip">&ldquo;{e.chip}&rdquo;</p>}
              {e.text && <p>{e.text}</p>}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
