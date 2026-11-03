import { useEffect, useState } from 'react'
import BadgeIcon from './BadgeIcon.jsx'
import { Sola } from './Guide.jsx'
import Icon from './Icons.jsx'

export function XPBar({ level, compact = false }) {
  if (!level) return null
  const pct = Math.round(level.progress * 100)
  return (
    <div className={`xpbar ${compact ? 'compact' : ''}`}>
      <div className="xpbar-level" title={level.title}>
        <span>Lv</span>
        <b>{level.level}</b>
      </div>
      <div className="xpbar-main">
        {!compact && (
          <div className="xpbar-top">
            <b>{level.title}</b>
            <span>{level.next ? `${level.xp - level.floor} / ${level.next - level.floor} XP` : `${level.xp} XP`}</span>
          </div>
        )}
        <div className="xpbar-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to next level">
          <div className="xpbar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}

export function CountUp({ to, duration = 900 }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = t => {
      const p = Math.min(1, (t - start) / duration)
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])
  return <>{n}</>
}

export function XPSummary({ result }) {
  if (!result) return null
  return (
    <div className="xp-summary">
      <div className="xp-total">
        <Icon name="sparkle" size={28} />
        <span>+<CountUp to={result.xp} /> XP</span>
      </div>
      <ul className="xp-lines">
        {result.breakdown.map((b, i) => (
          <li key={i} style={{ '--d': `${i * 80}ms` }}><span>{b.label}</span><b>+{b.xp}</b></li>
        ))}
      </ul>
      {result.note && <p className="muted small">{result.note}</p>}
    </div>
  )
}

function Confetti() {
  const colors = ['#F2836B', '#F5C451', '#7EC4E6', '#6BAF6B', '#9C8FD6', '#E57A9A']
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 36 }).map((_, i) => (
        <i key={i} style={{ '--x': `${(i * 37) % 100}%`, '--c': colors[i % colors.length], '--d': `${(i % 9) * 0.12}s`, '--r': `${(i * 47) % 360}deg` }} />
      ))}
    </div>
  )
}

export function Celebration({ data, onClose }) {
  useEffect(() => {
    if (!data) return
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [data, onClose])
  if (!data) return null
  const { levelUp, badges = [] } = data
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal celebrate" role="dialog" aria-modal="true" aria-label="Celebration" onClick={e => e.stopPropagation()}>
        <Confetti />
        {levelUp && (
          <div className="celebrate-level">
            <Sola size={90} className="bob" />
            <div className="eyebrow">Level up!</div>
            <div className="big-level">Level {levelUp.level}</div>
            <div className="level-title">{levelUp.title}</div>
          </div>
        )}
        {badges.length > 0 && (
          <div className="celebrate-badges">
            <div className="eyebrow">{badges.length > 1 ? 'New badges!' : 'New badge!'}</div>
            <div className="badge-pop">
              {badges.map(b => (
                <div key={b.id} className="badge-pop-item">
                  <BadgeIcon icon={b.icon} size={96} />
                  <b>{b.name}</b>
                  <span className="muted small">{b.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <button className="btn primary big" onClick={onClose} autoFocus>Awesome!</button>
      </div>
    </div>
  )
}
