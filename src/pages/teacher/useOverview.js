import { useCallback, useEffect, useState } from 'react'
import { api } from '../../api.js'

export function useApi(path) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const load = useCallback(() => {
    setError('')
    api(path).then(setData).catch(e => setError(e.message))
  }, [path])
  useEffect(load, [load])
  return { data, error, reload: load, setData }
}

export function ago(stamp) {
  if (!stamp) return 'Never'
  const ms = Date.now() - new Date(stamp.replace(' ', 'T') + 'Z').getTime()
  const m = Math.floor(ms / 60000)
  if (m < 2) return 'Just now'
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} h ago`
  const d = Math.floor(h / 24)
  return d === 1 ? 'Yesterday' : `${d} days ago`
}
