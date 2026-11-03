import { Link } from 'react-router-dom'

export default function Logo({ small = false, to = '/' }) {
  return (
    <Link to={to} className={`logo ${small ? 'small' : ''}`} aria-label="PeaceQuest home">
      <svg viewBox="0 0 48 48" width={small ? 28 : 38} height={small ? 28 : 38} aria-hidden="true">
        <path d="M24 44 Q6 32 6 18 A10 10 0 0 1 24 13 A10 10 0 0 1 42 18 Q42 32 24 44 Z" fill="#F2836B" />
        <path d="M14 26 Q24 16 34 26" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M14 26 V31 M24 21 V31 M34 26 V31 M11 31 H37" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span>Peace<b>Quest</b></span>
    </Link>
  )
}
