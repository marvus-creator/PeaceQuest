import { Link } from 'react-router-dom'
import Character from '../components/Character.jsx'
import { Sola } from '../components/Guide.jsx'
import Logo from '../components/Logo.jsx'
import { CAST } from '../../shared/cast.js'

const MODES = [
  { name: 'Conflict Resolver', color: '#F2836B', text: 'Branching stories where your choices change what happens next.' },
  { name: 'Emotion Detective', color: '#7EC4E6', text: 'Read faces, body language and hidden feelings in stories.' },
  { name: 'Friendship Quest', color: '#6BAF6B', text: 'Welcome new kids, include others and support friends.' },
  { name: 'Empathy Journey', color: '#E57A9A', text: 'Hear both sides of the same story, one perspective at a time.' },
  { name: 'Communication', color: '#9C8FD6', text: 'Build I-messages, real apologies and listen like a pro.' },
  { name: 'Calm Down Zone', color: '#4FB0A5', text: 'Breathing, grounding and private check-ins for big feelings.' },
]

export default function Landing() {
  const crew = [['keza', 'happy'], ['kofi', 'proud'], ['mei', 'hopeful'], ['tomas', 'surprised'], ['nia', 'calm']]
  return (
    <div className="landing">
      <header className="landing-top">
        <Logo />
        <div className="row gap-s">
          <Link to="/login" className="btn ghost">Log in</Link>
          <Link to="/join" className="btn primary">Join my class</Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">A social-emotional learning adventure for ages 8–14</p>
          <h1>Play. Understand.<br /><span className="hl">Resolve.</span> Grow.</h1>
          <p className="lead">PeaceQuest is an island of stories and challenges where children practise solving conflicts, understanding feelings and being a good friend. Every choice leads somewhere, and every path teaches something.</p>
          <div className="row gap-s wrap">
            <Link to="/join" className="btn primary big">Start your quest</Link>
            <Link to="/teacher/signup" className="btn big">I&rsquo;m a teacher</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-blob" />
          <div className="crew">
            {crew.map(([id, e], i) => (
              <div key={id} className="crew-member" style={{ '--i': i }}>
                <Character look={CAST[id]} emotion={e} size={i === 2 ? 150 : 118} />
              </div>
            ))}
          </div>
          <div className="hero-bubble">
            <Sola size={54} />
            <span>&ldquo;Hi! I&rsquo;m Sola. I&rsquo;ll guide you around the island.&rdquo;</span>
          </div>
        </div>
      </section>

      <section className="modes-strip">
        <h2>Six regions to explore</h2>
        <div className="mode-grid">
          {MODES.map(m => (
            <div className="mode-card" key={m.name} style={{ '--c': m.color }}>
              <span className="mode-dot" />
              <h3>{m.name}</h3>
              <p>{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="promise">
        <div className="promise-card">
          <h3>Teaches, never shames</h3>
          <p>When a choice doesn&rsquo;t go well, Sola explains what happened, how others might feel, and what else to try. Then you can rewind and explore.</p>
        </div>
        <div className="promise-card">
          <h3>More than one right answer</h3>
          <p>Real life is complicated. Many situations have several good paths, and XP rewards thinking and reflection, not guessing.</p>
        </div>
        <div className="promise-card">
          <h3>Private by design</h3>
          <p>Reflections stay private to each child. Check-ins are only shared with a teacher when the child chooses to.</p>
        </div>
      </section>

      <footer className="landing-foot">
        <Logo small />
        <span className="muted">Play. Understand. Resolve. Grow.</span>
      </footer>
    </div>
  )
}
