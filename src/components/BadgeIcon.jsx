const GLYPHS = {
  sprout: <g><path d="M50 74 V50" /><path d="M50 54 Q34 54 30 38 Q46 36 50 54" /><path d="M50 50 Q54 32 72 32 Q70 50 50 50" /></g>,
  bridge: <g><path d="M24 64 Q50 34 76 64" /><path d="M20 64 H80" /><path d="M34 52 V64 M50 46 V64 M66 52 V64" /></g>,
  magnifier: <g><circle cx="45" cy="45" r="15" /><path d="M56 56 L72 72" /></g>,
  hands: <g><path d="M24 56 L40 44 Q46 40 52 46 L60 54" /><path d="M76 56 L62 44 Q56 40 50 46" /><path d="M36 60 L46 68 M44 56 L54 64" /></g>,
  ear: <g><path d="M40 70 Q34 70 34 62 Q34 54 40 48 Q38 30 52 28 Q66 28 66 44 Q66 54 56 60 Q52 64 52 70 Q50 76 40 70" /><path d="M48 46 Q50 38 56 42" /></g>,
  heart: <path d="M50 72 Q26 56 26 42 A12 12 0 0 1 50 38 A12 12 0 0 1 74 42 Q74 56 50 72 Z" />,
  wave: <g><path d="M22 44 Q32 34 42 44 T62 44 T82 44" /><path d="M22 60 Q32 50 42 60 T62 60 T82 60" /></g>,
  lantern: <g><path d="M42 30 H58" /><path d="M50 24 V30" /><rect x="38" y="34" width="24" height="32" rx="8" /><path d="M42 70 H58" /><path d="M50 42 Q46 50 50 56 Q54 50 50 42" /></g>,
  rewind: <g><path d="M30 50 A20 20 0 1 0 36 36" /><path d="M30 28 V40 H42" /></g>,
  compass: <g><circle cx="50" cy="50" r="22" /><path d="M58 42 L46 46 L42 58 L54 54 Z" /></g>,
  map: <g><path d="M30 32 L42 28 L58 34 L70 30 V68 L58 72 L42 66 L30 70 Z" /><path d="M42 28 V66 M58 34 V72" /></g>,
  sun: <g><circle cx="50" cy="50" r="12" /><path d="M50 26 V32 M50 68 V74 M26 50 H32 M68 50 H74 M33 33 L37 37 M63 63 L67 67 M33 67 L37 63 M63 37 L67 33" /></g>,
}

const COLORS = {
  sprout: '#6BAF6B', bridge: '#F2836B', magnifier: '#7EC4E6', hands: '#6BAF6B', ear: '#9C8FD6', heart: '#E57A9A',
  wave: '#4FB0A5', lantern: '#E9A23B', rewind: '#5B8DEF', compass: '#F2836B', map: '#9C8FD6', sun: '#F5C451',
}

export default function BadgeIcon({ icon, earned = true, size = 72 }) {
  const c = COLORS[icon] || '#F5C451'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={`badge-icon ${earned ? '' : 'locked'}`} aria-hidden="true">
      <path d="M50 4 L61 12 L74 10 L80 22 L92 28 L90 41 L97 52 L89 62 L90 76 L77 81 L70 93 L57 90 L46 97 L36 89 L23 90 L18 78 L7 71 L10 58 L4 47 L13 38 L12 24 L25 19 L32 8 L45 10 Z" fill={earned ? c : '#D9D6CF'} />
      <circle cx="50" cy="50" r="34" fill={earned ? '#FFFCF5' : '#EEEBE4'} />
      <circle cx="50" cy="50" r="34" fill="none" stroke={earned ? c : '#C9C5BC'} strokeWidth="3" strokeDasharray="2 5" />
      <g fill="none" stroke={earned ? '#2B2B3A' : '#A8A49B'} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">{GLYPHS[icon] || GLYPHS.sun}</g>
    </svg>
  )
}
