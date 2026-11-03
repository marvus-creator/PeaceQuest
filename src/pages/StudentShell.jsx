import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth, useGame } from '../state.jsx'
import Logo from '../components/Logo.jsx'
import Character from '../components/Character.jsx'
import Icon from '../components/Icons.jsx'
import { XPBar, Celebration } from '../components/Rewards.jsx'

export default function StudentShell() {
  const { user, logout } = useAuth()
  const { progress, celebration, setCelebration, toast } = useGame()
  const nav = useNavigate()
  const links = [
    { to: '/play', label: 'Island', icon: 'map', end: true },
    { to: '/play/badges', label: 'Badges', icon: 'badge' },
    { to: '/play/journal', label: 'My journal', icon: 'journal' },
  ]
  return (
    <div className="shell student">
      <header className="topbar">
        <Logo to="/play" />
        <nav className="topnav" aria-label="Main">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>
              <Icon name={l.icon} size={18} />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="topbar-right">
          <div className="topbar-xp"><XPBar level={progress?.level} compact /></div>
          <button className="avatar-btn" onClick={() => nav('/play/avatar')} title="Edit my explorer" aria-label="Edit my explorer">
            <Character look={user.avatar} emotion="happy" size={40} />
          </button>
          <button className="icon-btn" onClick={() => { logout(); nav('/') }} title="Log out" aria-label="Log out">
            <Icon name="logout" size={20} />
          </button>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
      <nav className="bottomnav" aria-label="Main mobile">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>
            <Icon name={l.icon} size={22} />
            <span>{l.label}</span>
          </NavLink>
        ))}
        <NavLink to="/play/avatar" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>
          <Icon name="user" size={22} />
          <span>Me</span>
        </NavLink>
      </nav>
      <Celebration data={celebration} onClose={() => setCelebration(null)} />
      {toast && <div key={toast.id} className={`toast ${toast.kind}`} role="status">{toast.msg}</div>}
    </div>
  )
}
