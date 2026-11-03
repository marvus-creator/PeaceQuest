import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, getToken, setToken } from './api.js'

const AuthCtx = createContext(null)
const GameCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!getToken()) { setReady(true); return }
    api('/me')
      .then(d => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setReady(true))
  }, [])

  const login = useCallback(async (username, password) => {
    const d = await api('/auth/login', { method: 'POST', body: { username, password } })
    setToken(d.token)
    setUser(d.user)
    return d.user
  }, [])

  const register = useCallback(async (kind, body) => {
    const d = await api(`/auth/register-${kind}`, { method: 'POST', body })
    setToken(d.token)
    setUser(d.user)
    return d.user
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, setUser, ready, login, register, logout }), [user, ready, login, register, logout])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)

export function GameProvider({ children }) {
  const { user } = useAuth()
  const [progress, setProgress] = useState(null)
  const [celebration, setCelebration] = useState(null)
  const [toast, setToast] = useState(null)

  const refresh = useCallback(async () => {
    const p = await api('/progress')
    setProgress(p)
    return p
  }, [])

  useEffect(() => {
    if (user?.role === 'student') refresh().catch(() => {})
    else setProgress(null)
  }, [user, refresh])

  const complete = useCallback(async (activityId, payload) => {
    const r = await api('/play/complete', { method: 'POST', body: { activityId, payload } })
    setProgress(r.progress)
    return r
  }, [])

  const notify = useCallback((msg, kind = 'info') => {
    setToast({ msg, kind, id: Date.now() })
    setTimeout(() => setToast(t => (t && Date.now() - t.id >= 3000 ? null : t)), 3200)
  }, [])

  const value = useMemo(() => ({ progress, setProgress, refresh, complete, celebration, setCelebration, toast, notify }), [progress, refresh, complete, celebration, toast, notify])
  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>
}

export const useGame = () => useContext(GameCtx)
