import { Link } from 'react-router-dom'
import { Sola } from '../components/Guide.jsx'
import { useAuth } from '../state.jsx'

export function Loading({ label = 'Loading…' }) {
  return (
    <div className="center-screen">
      <Sola size={72} className="bob" />
      <p className="muted">{label}</p>
    </div>
  )
}

export function Forbidden({ need }) {
  const { user } = useAuth()
  const home = user?.role === 'teacher' ? '/teacher' : '/play'
  return (
    <div className="center-screen">
      <div className="card narrow center">
        <Sola size={84} mood="think" />
        <h1>{need === 'teacher' ? 'This area is for teachers' : 'This area is for students'}</h1>
        <p className="muted">{need === 'teacher' ? 'The teacher dashboard keeps everyone’s progress private, so only teachers can open it.' : 'Teachers can preview missions from the dashboard.'}</p>
        <Link className="btn primary" to={home}>Take me back</Link>
      </div>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="center-screen">
      <div className="card narrow center">
        <Sola size={84} mood="think" />
        <h1>This path leads nowhere</h1>
        <p className="muted">Looks like this page wandered off the map.</p>
        <Link className="btn primary" to="/">Back to PeaceQuest</Link>
      </div>
    </div>
  )
}

export function ErrorBox({ error, onRetry }) {
  return (
    <div className="card narrow center">
      <Sola size={64} mood="think" />
      <h2>Hmm, something went wrong</h2>
      <p className="muted">{error}</p>
      {onRetry && <button className="btn" onClick={onRetry}>Try again</button>}
    </div>
  )
}
