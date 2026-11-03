const KEY = 'peacequest.token'

export function getToken() {
  try { return localStorage.getItem(KEY) } catch { return null }
}

export function setToken(t) {
  try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY) } catch {}
}

export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const t = getToken()
  if (t) headers.Authorization = `Bearer ${t}`
  let res
  try {
    res = await fetch(`/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  } catch {
    throw new Error('Can’t reach PeaceQuest right now. Check that the server is running.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || 'Something went wrong.')
    err.status = res.status
    throw err
  }
  return data
}
