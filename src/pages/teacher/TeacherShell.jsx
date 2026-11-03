import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth, useGame } from '../../state.jsx'
import Logo from '../../components/Logo.jsx'
import Icon from '../../components/Icons.jsx'

export default function TeacherShell() {
  const { user, logout } = useAuth()
  const { toast } = useGame()
  const nav = useNavigate()
  const [copied, setCopied] = useState(false)
  useEffect(() => { if (copied) { const t = setTimeout(() => setCopied(false), 1600); return () => clearTimeout(t) } }, [copied])
  const links = [
    { to: '/teacher', label: 'Overview', icon: 'chart', end: true },
    { to: '/teacher/students', label: 'Students', icon: 'users' },
    { to: '/teacher/scenarios', label: 'Scenarios', icon: 'edit' },
    { to: '/teacher/assignments', label: 'Assignments', icon: 'flag' },
  ]
  const code = user.class?.code
  return (
    <div className="shell teacher">
      <aside className="sidebar">
        <Logo to="/teacher" />
        <div className="class-box">
          <span className="eyebrow">Your class</span>
          <b>{user.class?.name}</b>
          {code && (
            <button className="code-chip" onClick={() => { navigator.clipboard?.writeText(code).catch(() => {}); setCopied(true) }} title="Copy class code">
              <span>{code}</span>
              <Icon name={copied ? 'check' : 'copy'} size={14} />
            </button>
          )}
          <span className="small muted">{copied ? 'Copied!' : 'Students join with this code'}</span>
        </div>
        <nav className="side-nav" aria-label="Teacher">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
              <Icon name={l.icon} size={18} />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <div className="small"><b>{user.name}</b><br /><span className="muted">{user.username}</span></div>
          <button className="btn ghost small" onClick={() => { logout(); nav('/') }}><Icon name="logout" size={16} /> Log out</button>
        </div>
      </aside>
      <main className="t-page">
        <Outlet />
      </main>
      {toast && <div key={toast.id} className={`toast ${toast.kind}`} role="status">{toast.msg}</div>}
    </div>
  )
}
