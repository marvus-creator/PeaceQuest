import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { useGame } from '../state.jsx'
import Icon from '../components/Icons.jsx'
import { Loading, ErrorBox } from './Misc.jsx'
import StoryPlayer from '../games/StoryPlayer.jsx'
import Detective from '../games/Detective.jsx'
import Empathy from '../games/Empathy.jsx'
import Builder from '../games/Builder.jsx'
import Calm from '../games/Calm.jsx'
import { REGIONS } from '../../shared/progression.js'

export default function Mission() {
  const { id } = useParams()
  const { complete, setCelebration } = useGame()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [run, setRun] = useState(0)

  const load = useCallback(() => {
    setError('')
    setData(null)
    api(`/activity/${id}`).then(setData).catch(e => setError(e.message))
  }, [id])

  useEffect(load, [load])

  const finish = useCallback(async payload => {
    const r = await complete(id, payload)
    if (r.newBadges?.length || r.levelUp) setTimeout(() => setCelebration({ badges: r.newBadges || [], levelUp: r.levelUp }), 1100)
    return r
  }, [id, complete, setCelebration])

  if (error) return <div className="mission-page"><Link to="/play" className="back-link"><Icon name="back" size={18} /> Island</Link><ErrorBox error={error} onRetry={load} /></div>
  if (!data) return <Loading label="Getting the story ready…" />

  const a = data.activity
  const region = REGIONS.find(r => r.id === a.mode)
  const props = { activity: a, history: data.history, onFinish: finish, onReplay: () => setRun(n => n + 1) }
  const k = `${a.id}-${run}`
  const GAMES = { story: StoryPlayer, detective: Detective, empathy: Empathy, builder: Builder, calm: Calm }
  const Game = GAMES[a.kind]
  const game = Game ? <Game key={k} {...props} /> : <ErrorBox error={'This kind of mission isn’t ready yet.'} />
  return (
    <div className="mission-page" style={{ '--c': region?.color }}>
      <div className="mission-top">
        <Link to={`/play/region/${a.mode}`} className="back-link"><Icon name="back" size={18} /> {region?.name}</Link>
        <div className="mission-title">
          <span className="eyebrow">{a.custom ? 'From your teacher' : region?.mode}</span>
          <h1>{a.title}</h1>
        </div>
      </div>
      {game}
    </div>
  )
}
