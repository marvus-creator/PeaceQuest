import { useId } from 'react'

const INK = '#2B2B3A'
const BLUSH = 'rgba(242,120,100,0.45)'

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  const c = v => Math.max(0, Math.min(255, v))
  const r = c((n >> 16) + amt)
  const g = c(((n >> 8) & 255) + amt)
  const b = c((n & 255) + amt)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

function HairBack({ hair, color }) {
  switch (hair) {
    case 'long':
      return <path d="M44 92 Q42 40 100 38 Q158 40 156 92 L162 178 Q130 190 100 186 Q70 190 38 178 Z" fill={color} />
    case 'bob':
      return <path d="M46 96 Q44 42 100 40 Q156 42 154 96 L156 138 Q150 150 136 146 L64 146 Q50 150 44 138 Z" fill={color} />
    case 'braids':
      return (
        <g fill={color}>
          {[0, 1, 2, 3, 4].map(i => <ellipse key={`l${i}`} cx={52 - i * 1.5} cy={118 + i * 16} rx="9" ry="10" />)}
          {[0, 1, 2, 3, 4].map(i => <ellipse key={`r${i}`} cx={148 + i * 1.5} cy={118 + i * 16} rx="9" ry="10" />)}
        </g>
      )
    case 'puffs':
      return (
        <g fill={color}>
          <circle cx="50" cy="56" r="26" />
          <circle cx="150" cy="56" r="26" />
        </g>
      )
    case 'bun':
      return <circle cx="100" cy="36" r="20" fill={color} />
    default:
      return null
  }
}

function HairFront({ hair, color }) {
  const dark = shade(color, -18)
  switch (hair) {
    case 'short':
      return <path d="M50 92 Q48 46 100 44 Q152 46 150 92 Q140 70 118 66 Q96 74 70 68 Q56 76 50 92 Z" fill={color} />
    case 'buzz':
      return <path d="M52 88 Q52 48 100 47 Q148 48 148 88 Q140 64 100 60 Q60 64 52 88 Z" fill={color} opacity="0.92" />
    case 'curly':
      return (
        <g fill={color}>
          {[[58, 72], [70, 56], [86, 48], [104, 46], [122, 50], [138, 60], [146, 76], [52, 88], [148, 92], [96, 60], [116, 62], [76, 66]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="15" />)}
          <circle cx="64" cy="64" r="6" fill={dark} />
          <circle cx="130" cy="58" r="5" fill={dark} />
        </g>
      )
    case 'puffs':
      return <path d="M52 90 Q50 50 100 48 Q150 50 148 90 Q138 66 100 64 Q62 66 52 90 Z" fill={color} />
    case 'long':
      return <path d="M50 96 Q48 46 100 44 Q152 46 150 96 Q146 72 126 64 Q110 76 82 72 Q60 76 50 96 Z" fill={color} />
    case 'braids':
      return (
        <g>
          <path d="M50 94 Q48 48 100 46 Q152 48 150 94 Q142 66 100 62 Q58 66 50 94 Z" fill={color} />
          <path d="M100 48 L100 64" stroke={dark} strokeWidth="2" />
          <path d="M78 52 L84 66 M122 52 L116 66" stroke={dark} strokeWidth="2" />
        </g>
      )
    case 'bob':
      return <path d="M48 98 Q46 46 100 44 Q154 46 152 98 Q150 76 140 70 L60 70 Q50 76 48 98 Z" fill={color} />
    case 'bun':
      return <path d="M52 90 Q50 50 100 48 Q150 50 148 90 Q138 66 100 62 Q62 66 52 90 Z" fill={color} />
    case 'messy':
      return <path d="M48 94 L46 70 L58 74 L56 52 L72 62 L78 42 L92 56 L102 38 L112 56 L126 42 L130 62 L146 54 L142 74 L154 72 L150 94 Q138 70 118 68 Q96 76 74 70 Q58 76 48 94 Z" fill={color} />
    default:
      return null
  }
}

function Eyes({ e, lookX = 0, lookY = 0 }) {
  const L = 80
  const R = 120
  const Y = 104
  const dot = (x, y, r = 4.6) => (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={r * 1.15} fill={INK} />
      <circle cx={x + 1.6} cy={y - 1.8} r={1.4} fill="#fff" />
    </g>
  )
  switch (e) {
    case 'happy':
    case 'proud':
      return (
        <g stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round">
          <path d={`M${L - 7} ${Y + 2} Q${L} ${Y - 7} ${L + 7} ${Y + 2}`} />
          <path d={`M${R - 7} ${Y + 2} Q${R} ${Y - 7} ${R + 7} ${Y + 2}`} />
        </g>
      )
    case 'calm':
      return (
        <g stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round">
          <path d={`M${L - 7} ${Y} Q${L} ${Y + 6} ${L + 7} ${Y}`} />
          <path d={`M${R - 7} ${Y} Q${R} ${Y + 6} ${R + 7} ${Y}`} />
        </g>
      )
    case 'scared':
    case 'surprised':
      return (
        <g>
          <circle cx={L} cy={Y} r="9" fill="#fff" stroke={INK} strokeWidth="2" />
          <circle cx={R} cy={Y} r="9" fill="#fff" stroke={INK} strokeWidth="2" />
          <circle cx={L} cy={Y} r={e === 'scared' ? 3 : 4.2} fill={INK} />
          <circle cx={R} cy={Y} r={e === 'scared' ? 3 : 4.2} fill={INK} />
        </g>
      )
    case 'angry':
    case 'frustrated':
      return (
        <g>
          <ellipse cx={L} cy={Y + 1} rx="5" ry="3.6" fill={INK} />
          <ellipse cx={R} cy={Y + 1} rx="5" ry="3.6" fill={INK} />
        </g>
      )
    case 'smirk':
      return (
        <g>
          <ellipse cx={L} cy={Y + 1} rx="5" ry="3.2" fill={INK} />
          {dot(R, Y)}
        </g>
      )
    case 'embarrassed':
    case 'shy':
      return (
        <g>
          {dot(L + 3, Y + 3, 4)}
          {dot(R + 3, Y + 3, 4)}
        </g>
      )
    case 'sad':
      return (
        <g>
          {dot(L, Y + 3, 4.4)}
          {dot(R, Y + 3, 4.4)}
        </g>
      )
    default:
      return (
        <g>
          {dot(L + lookX, Y + lookY)}
          {dot(R + lookX, Y + lookY)}
        </g>
      )
  }
}

function Brows({ e, color }) {
  const s = { stroke: color, strokeWidth: 4.5, strokeLinecap: 'round', fill: 'none' }
  const map = {
    angry: ['M68 88 L90 95', 'M132 88 L110 95'],
    frustrated: ['M68 90 L90 94', 'M132 90 L110 94'],
    sad: ['M70 92 L90 86', 'M130 92 L110 86'],
    worried: ['M70 91 L90 85', 'M130 91 L110 85'],
    nervous: ['M70 91 L90 85', 'M130 91 L110 85'],
    scared: ['M70 84 L90 78', 'M130 84 L110 78'],
    surprised: ['M70 84 Q80 76 90 82', 'M110 82 Q120 76 130 84'],
    smirk: ['M70 92 L90 92', 'M110 84 Q120 78 130 84'],
    proud: ['M70 88 Q80 84 90 88', 'M110 88 Q120 84 130 88'],
    hopeful: ['M70 89 Q80 84 90 88', 'M110 88 Q120 84 130 89'],
    embarrassed: ['M70 90 L90 87', 'M130 90 L110 87'],
    shy: ['M70 90 L90 87', 'M130 90 L110 87'],
  }
  const d = map[e] || ['M70 90 Q80 87 90 90', 'M110 90 Q120 87 130 90']
  return (
    <g {...s}>
      <path d={d[0]} />
      <path d={d[1]} />
    </g>
  )
}

function Mouth({ e }) {
  const s = { stroke: INK, strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }
  switch (e) {
    case 'happy':
      return (
        <g>
          <path d="M84 124 Q100 146 116 124 Z" fill={INK} />
          <path d="M91 134 Q100 141 109 134 Q100 130 91 134 Z" fill="#E86A6A" />
        </g>
      )
    case 'proud':
      return <path d="M86 126 Q102 138 116 124" {...s} />
    case 'hopeful':
      return <path d="M88 127 Q100 135 112 127" {...s} />
    case 'calm':
      return <path d="M89 127 Q100 133 111 127" {...s} />
    case 'sad':
      return <path d="M86 134 Q100 122 114 134" {...s} />
    case 'angry':
      return <path d="M86 132 Q100 124 114 132 Z" fill={INK} />
    case 'frustrated':
      return <path d="M84 130 L90 126 L96 131 L102 126 L108 131 L116 127" {...s} />
    case 'scared':
      return <path d="M88 136 Q90 124 100 124 Q110 124 112 136 Q100 132 88 136 Z" fill={INK} />
    case 'surprised':
      return <ellipse cx="100" cy="131" rx="7" ry="9" fill={INK} />
    case 'worried':
    case 'nervous':
      return <path d="M88 131 Q94 127 100 131 Q106 135 112 131" {...s} />
    case 'embarrassed':
      return <path d="M88 128 Q94 133 100 129 Q106 133 112 128" {...s} />
    case 'shy':
      return <path d="M93 129 Q100 133 107 129" {...s} />
    case 'smirk':
      return <path d="M88 130 Q104 132 114 122" {...s} />
    default:
      return <path d="M90 129 Q100 132 110 129" {...s} />
  }
}

function Extras({ e }) {
  const out = []
  if (['happy', 'embarrassed', 'shy', 'proud', 'hopeful', 'calm'].includes(e)) {
    const op = e === 'embarrassed' || e === 'shy' ? 1 : 0.7
    out.push(<ellipse key="bl" cx="68" cy="120" rx="10" ry="6" fill={BLUSH} opacity={op} />, <ellipse key="br" cx="132" cy="120" rx="10" ry="6" fill={BLUSH} opacity={op} />)
  }
  if (e === 'embarrassed') out.push(<path key="em" d="M60 114 l4 -4 M66 116 l4 -4 M130 116 l4 -4 M136 114 l4 -4" stroke="#D9534F" strokeWidth="2" strokeLinecap="round" />)
  if (e === 'angry') out.push(<ellipse key="ar" cx="100" cy="118" rx="44" ry="20" fill="rgba(217,83,79,0.12)" />)
  if (['scared', 'nervous', 'worried', 'embarrassed'].includes(e)) out.push(<path key="sw" d="M146 78 Q152 88 146 94 Q140 88 146 78 Z" fill="#9FD3F0" stroke="#5FA8D3" strokeWidth="1.5" />)
  if (e === 'sad') out.push(<path key="tear" d="M122 112 Q126 122 122 126 Q118 122 122 112 Z" fill="#9FD3F0" />)
  if (e === 'frustrated') out.push(<g key="st" stroke="#B9B9C6" strokeWidth="3" strokeLinecap="round" fill="none"><path d="M40 52 q-6 -8 0 -16" /><path d="M160 52 q6 -8 0 -16" /></g>)
  return <g>{out}</g>
}

function Accessory({ extra, color }) {
  switch (extra) {
    case 'glasses':
      return (
        <g stroke={INK} strokeWidth="2.6" fill="rgba(255,255,255,0.18)">
          <circle cx="80" cy="104" r="12" />
          <circle cx="120" cy="104" r="12" />
          <path d="M92 104 Q100 99 108 104" fill="none" />
        </g>
      )
    case 'cap':
      return (
        <g>
          <path d="M50 80 Q52 42 100 40 Q148 42 150 80 Z" fill="#D9534F" />
          <path d="M100 76 Q150 70 172 84 Q150 92 104 86 Z" fill="#B94541" />
          <circle cx="100" cy="42" r="4" fill="#B94541" />
        </g>
      )
    case 'headband':
      return <path d="M52 78 Q100 52 148 78" stroke="#F5C451" strokeWidth="8" fill="none" strokeLinecap="round" />
    case 'freckles':
      return (
        <g fill={shade(color, -50)} opacity="0.55">
          <circle cx="66" cy="116" r="1.6" /><circle cx="72" cy="120" r="1.6" /><circle cx="64" cy="122" r="1.6" />
          <circle cx="134" cy="116" r="1.6" /><circle cx="128" cy="120" r="1.6" /><circle cx="136" cy="122" r="1.6" />
        </g>
      )
    default:
      return null
  }
}

function Arms({ pose, skin, shirt }) {
  const sleeve = { stroke: shirt, strokeWidth: 24, strokeLinecap: 'round', fill: 'none' }
  const sh = shade(shirt, -22)
  const hand = (x, y, r = 12) => <circle cx={x} cy={y} r={r} fill={skin} />
  switch (pose) {
    case 'crossed':
      return (
        <g>
          <path d="M52 196 Q60 236 100 230" {...sleeve} stroke={sh} />
          <path d="M148 196 Q140 236 100 222" {...sleeve} />
          {hand(70, 222, 11)}
          {hand(130, 230, 11)}
        </g>
      )
    case 'up':
      return (
        <g>
          <path d="M56 190 Q34 140 26 92" {...sleeve} />
          <path d="M144 190 Q166 140 174 92" {...sleeve} />
          {hand(26, 84)}
          {hand(174, 84)}
        </g>
      )
    case 'cover':
      return (
        <g>
          <path d="M56 196 Q50 150 76 116" {...sleeve} />
          <path d="M144 196 Q150 150 124 116" {...sleeve} />
          <ellipse cx="80" cy="106" rx="17" ry="20" fill={skin} stroke={shade(skin, -25)} strokeWidth="1.5" />
          <ellipse cx="120" cy="106" rx="17" ry="20" fill={skin} stroke={shade(skin, -25)} strokeWidth="1.5" />
        </g>
      )
    case 'fists':
      return (
        <g>
          <path d="M54 190 Q40 230 46 262" {...sleeve} />
          <path d="M146 190 Q160 230 154 262" {...sleeve} />
          <rect x="34" y="256" width="24" height="22" rx="9" fill={skin} stroke={shade(skin, -30)} strokeWidth="2" />
          <rect x="142" y="256" width="24" height="22" rx="9" fill={skin} stroke={shade(skin, -30)} strokeWidth="2" />
          <path d="M30 246 l-8 -4 M28 258 l-9 0 M170 246 l8 -4 M172 258 l9 0" stroke="#D9534F" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )
    case 'hug':
      return (
        <g>
          <path d="M54 194 Q70 244 140 214" {...sleeve} stroke={sh} />
          <path d="M146 194 Q130 248 60 222" {...sleeve} />
          {hand(140, 212, 11)}
          {hand(60, 220, 11)}
        </g>
      )
    case 'slump':
      return (
        <g>
          <path d="M58 200 Q50 240 62 272" {...sleeve} />
          <path d="M142 200 Q150 240 138 272" {...sleeve} />
          {hand(62, 276)}
          {hand(138, 276)}
        </g>
      )
    default:
      return (
        <g>
          <path d="M54 192 Q44 232 48 266" {...sleeve} />
          <path d="M146 192 Q156 232 152 266" {...sleeve} />
          {hand(48, 270)}
          {hand(152, 270)}
        </g>
      )
  }
}

export default function Character({ look, emotion = 'neutral', pose = null, size = 160, className = '', flip = false, title }) {
  const uid = useId().replace(/:/g, '')
  const l = look || {}
  const skin = l.skin || '#C68B59'
  const hair = l.hair || 'short'
  const hairColor = l.hairColor || '#1A120C'
  const shirt = l.shirt || '#2F9C95'
  const extra = l.glasses ? 'glasses' : l.extra || 'none'
  const body = !!pose
  const h = body ? 300 : 220
  const slump = pose === 'slump'
  const proud = emotion === 'proud' && !body
  const headTransform = slump ? 'translate(0 16) rotate(6 100 100)' : proud ? 'rotate(-5 100 100)' : undefined
  const w = size
  const hh = Math.round((size * h) / 200)
  return (
    <svg
      viewBox={`0 0 200 ${h}`}
      width={w}
      height={hh}
      className={`character ${className}`}
      role="img"
      aria-label={title || `${l.name || 'Character'} looking ${emotion}`}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <defs>
        <clipPath id={`clip-${uid}`}>
          <rect x="0" y="0" width="200" height={h} rx="0" />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${uid})`}>
        {body ? (
          <path d={slump ? 'M40 300 L46 196 Q100 168 154 196 L160 300 Z' : 'M42 300 L48 186 Q100 158 152 186 L158 300 Z'} fill={shirt} />
        ) : (
          <path d="M22 220 Q24 166 100 158 Q176 166 178 220 Z" fill={shirt} />
        )}
        <path d={body ? 'M80 172 Q100 186 120 172' : 'M80 162 Q100 176 120 162'} stroke={shade(shirt, -30)} strokeWidth="4" fill="none" strokeLinecap="round" />
        <rect x="88" y={body ? 140 : 136} width="24" height="30" rx="8" fill={shade(skin, -14)} />
        {l.whistle && <g><path d="M86 168 L100 196 L114 168" stroke="#F5C451" strokeWidth="2.5" fill="none" /><rect x="94" y="194" width="14" height="9" rx="3" fill="#C9CED6" /></g>}
        {body && pose !== 'up' && pose !== 'cover' && pose !== 'crossed' && pose !== 'hug' ? <Arms pose={pose} skin={skin} shirt={shade(shirt, -10)} /> : null}
        <g transform={headTransform}>
          <HairBack hair={hair} color={hairColor} />
          <circle cx="51" cy="106" r="10" fill={skin} />
          <circle cx="149" cy="106" r="10" fill={skin} />
          <ellipse cx="100" cy="100" rx="50" ry="53" fill={skin} />
          <ellipse cx="100" cy="132" rx="34" ry="14" fill={shade(skin, 8)} opacity="0.35" />
          <HairFront hair={hair} color={hairColor} />
          <Extras e={emotion} />
          <Brows e={emotion} color={shade(hairColor, 10)} />
          <Eyes e={emotion} />
          <Mouth e={emotion} />
          <Accessory extra={extra} color={skin} />
        </g>
        {body && (pose === 'up' || pose === 'cover' || pose === 'crossed' || pose === 'hug') ? <Arms pose={pose} skin={skin} shirt={shade(shirt, -10)} /> : null}
      </g>
    </svg>
  )
}
