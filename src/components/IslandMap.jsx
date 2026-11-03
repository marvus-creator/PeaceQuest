import Character from './Character.jsx'

const SPOTS = {
  calm: { x: 410, y: 500 },
  detective: { x: 250, y: 360 },
  conflict: { x: 520, y: 318 },
  friendship: { x: 270, y: 170 },
  communication: { x: 800, y: 390 },
  empathy: { x: 730, y: 160 },
}

function Landmark({ id }) {
  switch (id) {
    case 'calm':
      return (
        <g>
          <ellipse cx="0" cy="18" rx="90" ry="30" fill="#F6E2B3" />
          <path d="M-70 26 Q-50 16 -30 26 T10 26 T50 26" stroke="#7EC4E6" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M40 10 Q36 -30 44 -58" stroke="#9C7552" strokeWidth="7" fill="none" strokeLinecap="round" />
          <g fill="#6BAF6B"><path d="M44 -58 Q10 -66 -4 -46 Q24 -54 44 -58 Z" /><path d="M44 -58 Q80 -70 92 -48 Q66 -56 44 -58 Z" /><path d="M44 -58 Q30 -90 54 -96 Q50 -76 44 -58 Z" /></g>
          <circle cx="-30" cy="0" r="14" fill="#F2836B" opacity="0.85" />
          <path d="M-44 0 h28" stroke="#fff" strokeWidth="3" />
        </g>
      )
    case 'detective':
      return (
        <g>
          <ellipse cx="0" cy="6" rx="86" ry="44" fill="#8FCBE6" />
          <ellipse cx="0" cy="6" rx="66" ry="30" fill="#A9DAF0" />
          <path d="M-30 0 q10 -6 20 0 M10 14 q10 -6 20 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
          <g transform="translate(46 -40)"><circle r="18" fill="#fff" stroke="#2B2B3A" strokeWidth="5" /><path d="M13 13 L28 28" stroke="#2B2B3A" strokeWidth="7" strokeLinecap="round" /><circle r="8" fill="#7EC4E6" opacity="0.5" /></g>
          <g fill="#6FA56A"><circle cx="-80" cy="-14" r="16" /><circle cx="-66" cy="-26" r="13" /></g>
        </g>
      )
    case 'conflict':
      return (
        <g>
          <path d="M-90 30 Q0 -50 90 30" stroke="#C0795A" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M-90 30 Q0 -30 90 30" stroke="#E79A78" strokeWidth="8" fill="none" />
          {[-60, -30, 0, 30, 60].map(x => <path key={x} d={`M${x} ${30 - (90 - Math.abs(x)) * 0.45} V30`} stroke="#C0795A" strokeWidth="5" />)}
          <path d="M-96 30 H96" stroke="#9C5A3E" strokeWidth="8" strokeLinecap="round" />
          <circle cx="0" cy="-36" r="9" fill="#F5C451" />
        </g>
      )
    case 'friendship':
      return (
        <g>
          <g fill="#5E9C5E">
            <path d="M-60 30 L-36 -40 L-12 30 Z" /><path d="M20 30 L48 -56 L76 30 Z" />
          </g>
          <g fill="#6BAF6B">
            <path d="M-20 34 L10 -60 L40 34 Z" /><path d="M-90 34 L-70 -16 L-50 34 Z" />
          </g>
          <g fill="#7DB476"><circle cx="-6" cy="36" r="16" /><circle cx="60" cy="38" r="14" /></g>
          <g stroke="#8A6A45" strokeWidth="5"><path d="M10 34 V46" /><path d="M48 30 V44" /><path d="M-36 30 V42" /></g>
          <path d="M-10 -10 Q-4 -18 2 -10 Q8 -18 14 -10 Q14 -2 2 6 Q-10 -2 -10 -10 Z" fill="#E57A9A" />
        </g>
      )
    case 'communication':
      return (
        <g>
          <path d="M-26 40 L-16 -60 H16 L26 40 Z" fill="#9C8FD6" />
          <path d="M-22 4 H22 M-19 -28 H19" stroke="#fff" strokeWidth="6" />
          <rect x="-22" y="-84" width="44" height="26" rx="6" fill="#F5C451" />
          <path d="M-26 -84 L0 -104 L26 -84 Z" fill="#7C6A9E" />
          <g stroke="#F5C451" strokeWidth="4" strokeLinecap="round" opacity="0.8"><path d="M-36 -72 L-62 -78" /><path d="M36 -72 L62 -78" /><path d="M-34 -62 L-56 -54" /><path d="M34 -62 L56 -54" /></g>
          <rect x="-10" y="18" width="20" height="22" rx="10" fill="#5C4E80" />
        </g>
      )
    case 'empathy':
      return (
        <g>
          <path d="M-100 40 L-40 -60 L0 0 L36 -76 L100 40 Z" fill="#C7A8C9" />
          <path d="M-40 -60 L-28 -40 L-48 -36 Z M36 -76 L50 -50 L26 -52 Z" fill="#fff" />
          <path d="M-100 40 Q0 0 100 40 Z" fill="#E7B7C6" />
          <path d="M-14 22 Q-6 12 2 22 Q10 12 18 22 Q18 30 2 40 Q-14 30 -14 22 Z" fill="#E57A9A" />
          <path d="M-60 6 q8 -6 16 0 M40 6 q8 -6 16 0" stroke="#fff" strokeWidth="3" fill="none" opacity="0.8" />
        </g>
      )
    default:
      return null
  }
}

export default function IslandMap({ regions, onSelect, avatar, here = 'calm' }) {
  const order = ['calm', 'detective', 'conflict', 'friendship', 'communication', 'empathy']
  const pathD = order.map((id, i) => `${i ? 'L' : 'M'}${SPOTS[id].x} ${SPOTS[id].y + 46}`).join(' ')
  const hereSpot = SPOTS[here] || SPOTS.calm
  return (
    <div className="island-wrap">
      <svg className="island" viewBox="0 0 1000 620" role="group" aria-label="Map of PeaceQuest Island">
        <rect width="1000" height="620" fill="#BFE3EE" />
        <g stroke="#fff" strokeWidth="3" opacity="0.5" fill="none" strokeLinecap="round">
          <path d="M40 80 q20 -12 40 0 t40 0" /><path d="M880 560 q20 -12 40 0 t40 0" /><path d="M60 560 q20 -12 40 0" /><path d="M900 80 q20 -12 40 0" />
        </g>
        <path d="M120 300 Q90 140 250 80 Q420 30 560 70 Q760 40 880 140 Q960 240 920 380 Q900 520 720 560 Q560 600 400 580 Q200 570 140 470 Q100 400 120 300 Z" fill="#F3E3B8" />
        <path d="M140 300 Q120 160 260 100 Q420 56 560 92 Q750 66 860 156 Q930 250 896 376 Q872 500 712 536 Q560 572 404 554 Q220 546 162 456 Q128 392 140 300 Z" fill="#B9DB9C" />
        <path d="M560 92 Q520 180 540 260 Q560 340 500 420 Q460 480 470 560" stroke="#8FCBE6" strokeWidth="26" fill="none" strokeLinecap="round" />
        <path d={pathD} stroke="#fff" strokeWidth="6" strokeDasharray="2 14" strokeLinecap="round" fill="none" opacity="0.95" />
        {regions.map(r => {
          const s = SPOTS[r.id]
          if (!s) return null
          const act = () => onSelect(r)
          return (
            <g
              key={r.id}
              className={`region ${r.unlocked ? 'open' : 'locked'}`}
              transform={`translate(${s.x} ${s.y})`}
              role="button"
              tabIndex={0}
              aria-label={r.unlocked ? `${r.name}: ${r.mode}` : `${r.name}: unlocks at level ${r.unlock}`}
              onClick={act}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act() } }}
            >
              <ellipse className="region-glow" cx="0" cy="10" rx="110" ry="74" fill={r.color} opacity="0" />
              <g className="landmark"><Landmark id={r.id} /></g>
              <g transform="translate(0 74)">
                <rect x={-r.name.length * 6.8 - 20} y="-20" width={r.name.length * 13.6 + 40} height="40" rx="20" fill="#fff" stroke={r.unlocked ? r.color : '#C9C5BC'} strokeWidth="3" />
                <text textAnchor="middle" y="7" className="region-label">{r.name}</text>
              </g>
              {!r.unlocked && (
                <g transform="translate(0 -6)">
                  <circle r="26" fill="#3B3A48" opacity="0.9" />
                  <path d="M-9 -2 H9 V12 H-9 Z M-5.5 -2 V-7 A5.5 5.5 0 0 1 5.5 -7 V-2" stroke="#fff" strokeWidth="3" fill="none" strokeLinejoin="round" />
                  <g transform="translate(0 42)"><rect x="-34" y="-12" width="68" height="24" rx="12" fill="#3B3A48" /><text textAnchor="middle" y="5" fill="#fff" fontSize="14" fontWeight="700">Level {r.unlock}</text></g>
                </g>
              )}
            </g>
          )
        })}
        <g className="here-marker" transform={`translate(${hereSpot.x + 62} ${hereSpot.y - 128})`}>
          <circle cx="30" cy="30" r="32" fill="#fff" stroke="#2F9C95" strokeWidth="4" />
          <clipPath id="here-clip"><circle cx="30" cy="30" r="28" /></clipPath>
          <g clipPath="url(#here-clip)">
            <svg x="3" y="5" width="54" height="60" viewBox="0 0 54 60" overflow="visible">
              <Character look={avatar} emotion="happy" size={54} />
            </svg>
          </g>
          <path d="M22 60 L30 74 L38 60 Z" fill="#2F9C95" />
        </g>
      </svg>
    </div>
  )
}
