export function Sola({ size = 64, mood = 'happy', className = '' }) {
  return (
    <svg className={`sola ${className}`} width={size} height={size} viewBox="0 0 100 100" aria-label="Sola the guide bird" role="img">
      <path d="M50 14 Q54 4 60 8 Q56 12 54 18 Z" fill="#E9A23B" />
      <ellipse cx="50" cy="56" rx="34" ry="32" fill="#F5C451" />
      <ellipse cx="52" cy="66" rx="20" ry="16" fill="#FCE7A8" />
      <path d="M22 58 Q12 70 24 80 Q30 70 30 60 Z" fill="#E9A23B" />
      <path d="M78 58 Q88 70 76 80 Q70 70 70 60 Z" fill="#E9A23B" />
      {mood === 'think' ? (
        <g stroke="#2B2B3A" strokeWidth="3" strokeLinecap="round" fill="none"><path d="M36 48 h8" /><path d="M58 48 h8" /></g>
      ) : (
        <g fill="#2B2B3A"><circle cx="40" cy="48" r="4.5" /><circle cx="62" cy="48" r="4.5" /><circle cx="41.5" cy="46.5" r="1.4" fill="#fff" /><circle cx="63.5" cy="46.5" r="1.4" fill="#fff" /></g>
      )}
      <path d="M46 56 L56 56 L51 63 Z" fill="#F2836B" />
      <ellipse cx="32" cy="58" rx="5" ry="3" fill="#F2836B" opacity="0.4" />
      <ellipse cx="70" cy="58" rx="5" ry="3" fill="#F2836B" opacity="0.4" />
      <path d="M40 88 v6 M60 88 v6" stroke="#E9A23B" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function GuideNote({ children, title = 'Sola says', mood = 'happy', tone = 'neutral' }) {
  return (
    <div className={`guide-note tone-${tone}`}>
      <Sola size={56} mood={mood} />
      <div>
        <div className="guide-title">{title}</div>
        <div className="guide-body">{children}</div>
      </div>
    </div>
  )
}
