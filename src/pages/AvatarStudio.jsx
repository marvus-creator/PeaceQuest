import { useState } from 'react'
import { useAuth, useGame } from '../state.jsx'
import { api } from '../api.js'
import AvatarPicker from '../components/AvatarPicker.jsx'
import Character from '../components/Character.jsx'

const FACES = ['happy', 'proud', 'calm', 'surprised', 'worried', 'sad', 'frustrated', 'angry']

export default function AvatarStudio() {
  const { user, setUser } = useAuth()
  const { notify } = useGame()
  const [avatar, setAvatar] = useState(user.avatar)
  const [busy, setBusy] = useState(false)

  async function save() {
    setBusy(true)
    try {
      const r = await api('/me/avatar', { method: 'PUT', body: { avatar } })
      setUser(u => ({ ...u, avatar: r.avatar }))
      notify('Your explorer looks great!', 'good')
    } catch (e) {
      notify(e.message, 'warn')
    } finally {
      setBusy(false)
    }
  }

  const changed = JSON.stringify(avatar) !== JSON.stringify(user.avatar)
  return (
    <div className="avatar-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Explorer studio</p>
          <h1>Make your explorer</h1>
          <p className="muted">Your explorer appears in every story you play.</p>
        </div>
        <button className="btn primary big" onClick={save} disabled={!changed || busy}>{busy ? 'Saving…' : changed ? 'Save changes' : 'Saved'}</button>
      </header>
      <div className="card">
        <AvatarPicker value={avatar} onChange={setAvatar} />
      </div>
      <div className="card">
        <div className="card-head"><h2>Your explorer feels things too</h2></div>
        <div className="face-strip">
          {FACES.map(f => (
            <div key={f} className="face-cell">
              <Character look={avatar} emotion={f} size={86} />
              <span>{f.charAt(0).toUpperCase() + f.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
