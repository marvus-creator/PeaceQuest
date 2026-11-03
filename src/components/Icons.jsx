const P = {
  home: 'M3 11 L12 4 L21 11 M5 10 V20 H19 V10',
  map: 'M9 4 L3 6 V20 L9 18 L15 20 L21 18 V4 L15 6 Z M9 4 V18 M15 6 V20',
  badge: 'M12 3 L14.5 8.5 L20 9 L16 13 L17 19 L12 16 L7 19 L8 13 L4 9 L9.5 8.5 Z',
  journal: 'M6 3 H18 V21 H6 Z M9 7 H15 M9 11 H15 M9 15 H12',
  user: 'M12 12 A4 4 0 1 0 12 4 A4 4 0 1 0 12 12 Z M4 21 Q4 14 12 14 Q20 14 20 21',
  users: 'M9 11 A3.5 3.5 0 1 0 9 4 A3.5 3.5 0 1 0 9 11 Z M2 20 Q2 14 9 14 Q16 14 16 20 M16 4.5 A3 3 0 0 1 16 10.5 M18 14 Q22 15 22 20',
  logout: 'M15 4 H19 V20 H15 M10 8 L6 12 L10 16 M6 12 H16',
  lock: 'M6 11 H18 V20 H6 Z M8.5 11 V8 A3.5 3.5 0 0 1 15.5 8 V11',
  check: 'M5 12.5 L10 17 L19 7',
  play: 'M8 5 L19 12 L8 19 Z',
  back: 'M15 5 L8 12 L15 19',
  next: 'M9 5 L16 12 L9 19',
  clock: 'M12 21 A9 9 0 1 0 12 3 A9 9 0 1 0 12 21 Z M12 7 V12 L15.5 14',
  chart: 'M4 20 H20 M7 16 V11 M12 16 V6 M17 16 V9',
  plus: 'M12 5 V19 M5 12 H19',
  trash: 'M5 7 H19 M10 7 V4 H14 V7 M7 7 L8 20 H16 L17 7',
  edit: 'M4 20 L4.5 16 L15 5.5 L18.5 9 L8 19.5 Z M13 7.5 L16.5 11',
  eyeoff: 'M3 3 L21 21 M10.6 6.1 Q11.3 6 12 6 Q18 6 21 12 Q20 14 18.5 15.5 M6.3 7.6 Q4.2 9.2 3 12 Q6 18 12 18 Q14 18 15.6 17.3 M9.9 10 A3 3 0 0 0 14 14',
  heart: 'M12 20 Q3 14 3 8.5 A4.5 4.5 0 0 1 12 6.5 A4.5 4.5 0 0 1 21 8.5 Q21 14 12 20 Z',
  x: 'M6 6 L18 18 M18 6 L6 18',
  rewind: 'M4 12 A8 8 0 1 0 6.5 6.3 M4 4 V9 H9',
  star: 'M12 3 L14.5 8.5 L20 9 L16 13 L17 19 L12 16 L7 19 L8 13 L4 9 L9.5 8.5 Z',
  sparkle: 'M12 3 Q13 10 20 12 Q13 14 12 21 Q11 14 4 12 Q11 10 12 3 Z',
  flag: 'M5 21 V4 M5 4 H17 L14.5 8 L17 12 H5',
  copy: 'M8 8 H19 V19 H8 Z M5 16 V5 H16',
  calendar: 'M4 6 H20 V20 H4 Z M4 10 H20 M8 3 V7 M16 3 V7',
  bulb: 'M9 18 H15 M10 21 H14 M12 3 A6 6 0 0 0 8 13.5 Q9 15 9 16 H15 Q15 15 16 13.5 A6 6 0 0 0 12 3 Z',
  shield: 'M12 3 L19 6 V11 Q19 17 12 21 Q5 17 5 11 V6 Z',
  volume: 'M4 9 H8 L13 5 V19 L8 15 H4 Z M16 9 Q18 12 16 15 M18.5 6.5 Q22 12 18.5 17.5',
  chat: 'M4 5 H20 V16 H10 L5 20 V16 H4 Z',
}

export default function Icon({ name, size = 20, stroke = 2, className = '', fill = 'none' }) {
  const solid = name === 'play' || (name === 'star' && fill !== 'none')
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill={solid ? 'currentColor' : fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={P[name] || P.star} />
    </svg>
  )
}
