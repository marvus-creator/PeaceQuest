import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../state.jsx'
import Logo from '../components/Logo.jsx'
import { Sola } from '../components/Guide.jsx'
import AvatarPicker from '../components/AvatarPicker.jsx'
import Character from '../components/Character.jsx'
import { CAST, DEFAULT_AVATAR } from '../../shared/cast.js'

function AuthFrame({ children, side }) {
  return (
    <div className="auth">
      <div className="auth-top"><Logo /></div>
      <div className="auth-body">
        <div className="auth-card card">{children}</div>
        <div className="auth-side" aria-hidden="true">{side}</div>
      </div>
    </div>
  )
}

function Field({ label, hint, ...props }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input {...props} />
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  )
}

export function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const u = await login(username.trim(), password)
      const from = loc.state?.from
      nav(from && from.startsWith(u.role === 'teacher' ? '/teacher' : '/play') ? from : u.role === 'teacher' ? '/teacher' : '/play', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const demo = (u, p) => { setUsername(u); setPassword(p) }

  return (
    <AuthFrame side={<div className="auth-art"><Character look={CAST.keza} emotion="happy" size={200} /><div className="auth-speech">Welcome back, explorer!</div></div>}>
      <h1>Log in</h1>
      <p className="muted">Students use their username. Teachers use their email.</p>
      <form onSubmit={submit} className="stack">
        <Field label="Username or email" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" required autoFocus />
        <Field label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
        {error && <div className="form-error" role="alert">{error}</div>}
        <button className="btn primary big" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      </form>
      <div className="demo-box">
        <div className="demo-title">Demo accounts</div>
        <div className="row gap-s wrap">
          <button type="button" className="chip" onClick={() => demo('amani', 'peace123')}>Student: amani</button>
          <button type="button" className="chip" onClick={() => demo('tomas', 'peace123')}>Student: tomas</button>
          <button type="button" className="chip" onClick={() => demo('teacher@peacequest.school', 'peace1234')}>Teacher</button>
        </div>
      </div>
      <p className="auth-alt">New here? <Link to="/join">Join your class</Link> &middot; <Link to="/teacher/signup">Create a teacher account</Link></p>
    </AuthFrame>
  )
}

export function JoinClass() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ classCode: '', name: '', username: '', password: '' })
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function next(e) {
    e.preventDefault()
    setError('')
    if (step === 0 && form.classCode.trim().length < 3) return setError('Type the class code from your teacher.')
    if (step === 1) {
      if (form.name.trim().length < 2) return setError('Please tell us your first name.')
      if (!/^[a-zA-Z0-9_.]{3,30}$/.test(form.username)) return setError('Usernames use 3–30 letters, numbers, dots or underscores.')
      if (form.password.length < 6) return setError('Passwords need at least 6 characters.')
    }
    setStep(s => s + 1)
  }

  async function finish() {
    setBusy(true)
    setError('')
    try {
      await register('student', { ...form, avatar })
      nav('/play', { replace: true })
    } catch (err) {
      setError(err.message)
      if (/class code/i.test(err.message)) setStep(0)
      else if (/username/i.test(err.message)) setStep(1)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthFrame side={<div className="auth-art"><Sola size={150} className="bob" /><div className="auth-speech">{['Every adventure starts with a class code!', 'Pick a username you’ll remember.', 'Now make your explorer!'][step]}</div></div>}>
      <div className="steps" aria-label={`Step ${step + 1} of 3`}>
        {[0, 1, 2].map(i => <span key={i} className={`step-dot ${i <= step ? 'on' : ''}`} />)}
      </div>
      {step === 0 && (
        <form onSubmit={next} className="stack">
          <h1>Join your class</h1>
          <p className="muted">Your teacher has a class code that looks like <b>SUN-42</b>.</p>
          <Field label="Class code" value={form.classCode} onChange={set('classCode')} placeholder="SUN-42" autoFocus style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }} />
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="btn primary big">Next</button>
          <p className="auth-alt">Already have an account? <Link to="/login">Log in</Link></p>
        </form>
      )}
      {step === 1 && (
        <form onSubmit={next} className="stack">
          <h1>About you</h1>
          <p className="muted">Only use your first name. No emails needed.</p>
          <Field label="First name" value={form.name} onChange={set('name')} autoFocus maxLength={40} />
          <Field label="Username" value={form.username} onChange={set('username')} hint="You’ll use this to log in." maxLength={30} autoComplete="username" />
          <Field label="Password" type="password" value={form.password} onChange={set('password')} hint="At least 6 characters." autoComplete="new-password" />
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="row gap-s">
            <button type="button" className="btn" onClick={() => setStep(0)}>Back</button>
            <button className="btn primary big grow">Next</button>
          </div>
        </form>
      )}
      {step === 2 && (
        <div className="stack">
          <h1>Create your explorer</h1>
          <AvatarPicker value={avatar} onChange={setAvatar} />
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="row gap-s">
            <button type="button" className="btn" onClick={() => setStep(1)}>Back</button>
            <button className="btn primary big grow" onClick={finish} disabled={busy}>{busy ? 'Creating…' : 'Start my quest'}</button>
          </div>
        </div>
      )}
    </AuthFrame>
  )
}

export function TeacherSignup() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', className: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await register('teacher', form)
      nav('/teacher', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthFrame side={<div className="auth-art"><Character look={CAST.uwase} emotion="happy" size={200} /><div className="auth-speech">You&rsquo;ll get a class code to share with students.</div></div>}>
      <h1>Teacher account</h1>
      <p className="muted">Create a class, track learning, write your own scenarios.</p>
      <form onSubmit={submit} className="stack">
        <Field label="Your name" value={form.name} onChange={set('name')} placeholder="Ms. Uwase" required autoFocus />
        <Field label="Email" type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
        <Field label="Password" type="password" value={form.password} onChange={set('password')} hint="At least 8 characters." required autoComplete="new-password" />
        <Field label="Class name" value={form.className} onChange={set('className')} placeholder="Class 5 Sunflowers" />
        {error && <div className="form-error" role="alert">{error}</div>}
        <button className="btn primary big" disabled={busy}>{busy ? 'Creating…' : 'Create my class'}</button>
      </form>
      <p className="auth-alt">Have an account? <Link to="/login">Log in</Link></p>
    </AuthFrame>
  )
}
