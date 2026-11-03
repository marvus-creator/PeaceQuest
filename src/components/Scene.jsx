const SKY = '#CFE8F3'

function Field() {
  return (
    <g>
      <rect width="800" height="300" fill={SKY} />
      <circle cx="680" cy="70" r="34" fill="#FBE29A" />
      <g fill="#fff" opacity="0.9"><ellipse cx="160" cy="70" rx="46" ry="16" /><ellipse cx="200" cy="60" rx="34" ry="16" /><ellipse cx="520" cy="50" rx="40" ry="13" /></g>
      <path d="M0 180 Q120 150 260 172 Q420 196 560 166 Q700 140 800 170 L800 300 L0 300 Z" fill="#9CCB86" />
      <g fill="#6FA56A"><circle cx="90" cy="160" r="26" /><circle cx="122" cy="152" r="22" /><circle cx="720" cy="150" r="28" /><circle cx="752" cy="160" r="20" /></g>
      <path d="M0 210 Q400 180 800 214 L800 300 L0 300 Z" fill="#88BF70" />
      <g stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round"><path d="M560 230 L560 170 L700 170 L700 230" /><path d="M560 170 L575 182 L685 182 L700 170" strokeWidth="2" opacity="0.7" /></g>
      <path d="M0 262 Q400 240 800 262" stroke="#fff" strokeWidth="3" opacity="0.6" fill="none" />
    </g>
  )
}

function Classroom() {
  return (
    <g>
      <rect width="800" height="300" fill="#F6E7CF" />
      <rect y="232" width="800" height="68" fill="#D9B88F" />
      <rect x="230" y="40" width="340" height="150" rx="10" fill="#3F6B5A" stroke="#8A6A45" strokeWidth="10" />
      <g stroke="#E8F1EC" strokeWidth="3" strokeLinecap="round" opacity="0.8" fill="none"><path d="M270 80 h90" /><path d="M270 104 h140" /><path d="M270 128 h60" /><path d="M470 80 q20 30 40 0 q20 -30 40 0" /></g>
      <rect x="40" y="50" width="130" height="120" rx="8" fill="#CFE8F3" stroke="#fff" strokeWidth="8" />
      <path d="M105 50 V170 M40 110 H170" stroke="#fff" strokeWidth="6" />
      <rect x="640" y="60" width="110" height="80" rx="6" fill="#fff" opacity="0.7" />
      <g fill="#F2836B"><rect x="652" y="74" width="24" height="24" rx="4" /><rect x="684" y="74" width="24" height="24" rx="4" fill="#7EC4E6" /><rect x="716" y="74" width="24" height="24" rx="4" fill="#F5C451" /></g>
      <rect x="0" y="222" width="800" height="12" fill="#C6A27A" />
    </g>
  )
}

function Lunch() {
  return (
    <g>
      <rect width="800" height="300" fill="#FBEBD8" />
      <rect y="236" width="800" height="64" fill="#E3C9A4" />
      {[60, 290, 520].map(x => <g key={x}><rect x={x} y="40" width="180" height="110" rx="10" fill="#CFE8F3" stroke="#fff" strokeWidth="8" /><path d={`M${x + 90} 40 V150`} stroke="#fff" strokeWidth="6" /></g>)}
      <rect x="40" y="196" width="720" height="18" rx="9" fill="#C98F5E" />
      <g><rect x="120" y="182" width="70" height="14" rx="4" fill="#7EC4E6" /><circle cx="140" cy="186" r="7" fill="#F5C451" /><rect x="470" y="182" width="70" height="14" rx="4" fill="#F2836B" /><circle cx="520" cy="186" r="7" fill="#6BAF6B" /></g>
      <path d="M0 160 H800" stroke="#F2D6B4" strokeWidth="8" />
    </g>
  )
}

function Playground() {
  return (
    <g>
      <rect width="800" height="300" fill={SKY} />
      <circle cx="110" cy="70" r="30" fill="#FBE29A" />
      <path d="M0 200 Q400 170 800 200 L800 300 L0 300 Z" fill="#A6D18E" />
      <g stroke="#E9A23B" strokeWidth="8" strokeLinecap="round" fill="none"><path d="M540 220 L580 100 L620 220" /><path d="M640 220 L680 100 L720 220" /><path d="M570 100 H690" /></g>
      <g stroke="#8A8A9A" strokeWidth="2"><path d="M610 100 V180" /><path d="M650 100 V180" /></g>
      <rect x="600" y="178" width="60" height="8" rx="3" fill="#F2836B" />
      <path d="M220 230 L260 120 L300 120 L300 230" fill="none" stroke="#5B8DEF" strokeWidth="8" strokeLinejoin="round" />
      <path d="M300 120 Q360 150 380 228" fill="none" stroke="#F5C451" strokeWidth="16" strokeLinecap="round" />
      <g><rect x="60" y="150" width="14" height="80" fill="#8A6A45" /><circle cx="67" cy="140" r="40" fill="#6FA56A" /><circle cx="40" cy="160" r="24" fill="#6FA56A" /></g>
    </g>
  )
}

function Library() {
  return (
    <g>
      <rect width="800" height="300" fill="#EFE3F2" />
      <rect y="240" width="800" height="60" fill="#C9A98A" />
      {[30, 300, 570].map(x => (
        <g key={x}>
          <rect x={x} y="40" width="200" height="190" rx="6" fill="#9C7552" />
          {[0, 1, 2].map(r => (
            <g key={r}>
              <rect x={x + 10} y={56 + r * 58} width="180" height="46" fill="#6E4F36" />
              {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={x + 14 + i * 19} y={60 + r * 58 + (i % 3) * 3} width="15" height={42 - (i % 3) * 3} rx="2" fill={['#F2836B', '#7EC4E6', '#F5C451', '#9C8FD6', '#6BAF6B', '#E57A9A'][(i + r * 2) % 6]} />)}
            </g>
          ))}
        </g>
      ))}
    </g>
  )
}

function Hallway() {
  return (
    <g>
      <rect width="800" height="300" fill="#E8EEF4" />
      <path d="M0 250 L800 250 L800 300 L0 300 Z" fill="#B8C4D0" />
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={i}>
          <rect x={20 + i * 78} y="70" width="70" height="176" rx="5" fill={i % 3 === 0 ? '#7EC4E6' : i % 3 === 1 ? '#9C8FD6' : '#4FB0A5'} />
          <path d={`M${30 + i * 78} 90 h22 M${30 + i * 78} 98 h22 M${30 + i * 78} 106 h22`} stroke="#fff" strokeWidth="2.5" opacity="0.6" />
          <rect x={74 + i * 78} y="150" width="6" height="20" rx="3" fill="#fff" opacity="0.7" />
        </g>
      ))}
      <rect y="40" width="800" height="14" fill="#F5C451" opacity="0.6" />
    </g>
  )
}

function Bench() {
  return (
    <g>
      <rect width="800" height="300" fill="#D7EEE8" />
      <circle cx="660" cy="64" r="28" fill="#FBE29A" />
      <path d="M0 190 Q400 160 800 190 L800 300 L0 300 Z" fill="#A6D18E" />
      <g><rect x="120" y="120" width="16" height="100" fill="#8A6A45" /><circle cx="128" cy="100" r="54" fill="#6FA56A" /><circle cx="90" cy="130" r="30" fill="#7DB476" /><circle cx="168" cy="126" r="32" fill="#7DB476" /></g>
      <g fill="#C98F5E"><rect x="360" y="190" width="200" height="12" rx="4" /><rect x="360" y="164" width="200" height="10" rx="4" /><rect x="380" y="200" width="10" height="34" /><rect x="530" y="200" width="10" height="34" /></g>
      <g fill="#7DB476"><circle cx="700" cy="220" r="26" /><circle cx="740" cy="226" r="20" /><circle cx="250" cy="226" r="18" /></g>
      <g fill="#F2836B"><circle cx="694" cy="210" r="4" /><circle cx="712" cy="222" r="4" /><circle cx="740" cy="216" r="4" /></g>
    </g>
  )
}

const SCENES = { field: Field, classroom: Classroom, lunch: Lunch, playground: Playground, library: Library, hallway: Hallway, bench: Bench }

export default function Scene({ name = 'classroom', className = '' }) {
  const S = SCENES[name] || Classroom
  return (
    <svg className={`scene ${className}`} viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <S />
    </svg>
  )
}
