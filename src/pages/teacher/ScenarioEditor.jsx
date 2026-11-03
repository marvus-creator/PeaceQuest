import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api.js'
import { useGame } from '../../state.jsx'
import Character from '../../components/Character.jsx'
import Scene from '../../components/Scene.jsx'
import Icon from '../../components/Icons.jsx'
import { Loading } from '../Misc.jsx'
import { CAST } from '../../../shared/cast.js'
import { SCENES } from '../../../shared/catalog.js'
import { SKILLS } from '../../../shared/progression.js'

const BLANK_CHOICE = q => ({ text: '', quality: q, reaction: '', feel: '', why: '', alternatives: [''] })
const BLANK = {
  title: '', blurb: '', scene: 'classroom', who: 'amani', emotion: 'neutral', intro: '', line: '', reflect: '', skills: ['conflict'],
  choices: [BLANK_CHOICE('helpful'), BLANK_CHOICE('unhelpful')],
}
const KIDS = Object.entries(CAST).filter(([, c]) => !c.adult)
const EMOTIONS = ['neutral', 'happy', 'sad', 'angry', 'worried', 'frustrated', 'embarrassed', 'scared']
const Q_LABEL = { helpful: 'Helpful', mixed: 'Partly helpful', unhelpful: 'Unhelpful' }

export default function ScenarioEditor() {
  const { id } = useParams()
  const nav = useNavigate()
  const { notify } = useGame()
  const [form, setForm] = useState(id ? null : BLANK)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!id) return
    api('/teacher/scenarios').then(d => {
      const s = d.scenarios.find(x => String(x.id) === id)
      if (!s) return setError('Scenario not found.')
      setForm({ ...BLANK, ...s.data, choices: s.data.choices.map(c => ({ ...c, alternatives: c.alternatives?.length ? c.alternatives : [''] })) })
    }).catch(e => setError(e.message))
  }, [id])

  if (error && !form) return <div className="card">{error}</div>
  if (!form) return <Loading />

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setChoice = (i, k, v) => setForm(f => ({ ...f, choices: f.choices.map((c, j) => (j === i ? { ...c, [k]: v } : c)) }))

  async function save(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (id) await api(`/teacher/scenarios/${id}`, { method: 'PUT', body: form })
      else await api('/teacher/scenarios', { method: 'POST', body: form })
      notify('Scenario saved. Students can play it in Harmony Bridge.', 'good')
      nav('/teacher/scenarios')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="editor">
      <Link to="/teacher/scenarios" className="back-link"><Icon name="back" size={18} /> Scenarios</Link>
      <header className="t-head">
        <div>
          <h1>{id ? 'Edit scenario' : 'New scenario'}</h1>
          <p className="muted small">Tip: include more than one reasonable choice, and explain unhelpful ones kindly. Students learn from every path.</p>
        </div>
      </header>
      <form className="editor-grid" onSubmit={save}>
        <div className="stack">
          <section className="card stack">
            <h2>The situation</h2>
            <label className="field"><span className="field-label">Title</span><input value={form.title} onChange={e => set('title', e.target.value)} placeholder="The Borrowed Jersey" maxLength={80} required /></label>
            <label className="field"><span className="field-label">Short description</span><input value={form.blurb} onChange={e => set('blurb', e.target.value)} placeholder="Shown on the mission card" maxLength={160} /></label>
            <label className="field"><span className="field-label">What happens (narration)</span><textarea rows={3} value={form.intro} onChange={e => set('intro', e.target.value)} maxLength={800} required /></label>
            <div className="row gap-s wrap">
              <label className="field grow"><span className="field-label">Character</span>
                <select value={form.who} onChange={e => set('who', e.target.value)}>{KIDS.map(([k, c]) => <option key={k} value={k}>{c.name}</option>)}</select>
              </label>
              <label className="field grow"><span className="field-label">Their feeling</span>
                <select value={form.emotion} onChange={e => set('emotion', e.target.value)}>{EMOTIONS.map(x => <option key={x} value={x}>{x}</option>)}</select>
              </label>
              <label className="field grow"><span className="field-label">Place</span>
                <select value={form.scene} onChange={e => set('scene', e.target.value)}>{SCENES.map(x => <option key={x} value={x}>{x}</option>)}</select>
              </label>
            </div>
            <label className="field"><span className="field-label">What {CAST[form.who]?.name} says (optional)</span><input value={form.line} onChange={e => set('line', e.target.value)} maxLength={300} /></label>
            <div className="field">
              <span className="field-label">Skills practised</span>
              <div className="chips">
                {Object.entries(SKILLS).map(([k, s]) => (
                  <button key={k} type="button" className={`chip ${form.skills.includes(k) ? 'on' : ''}`} onClick={() => set('skills', form.skills.includes(k) ? form.skills.filter(x => x !== k) : [...form.skills, k].slice(0, 4))}>{s.label}</button>
                ))}
              </div>
            </div>
          </section>

          {form.choices.map((c, i) => (
            <section key={i} className={`card stack choice-edit q-${c.quality}`}>
              <div className="row between">
                <h2>Choice {String.fromCharCode(65 + i)}</h2>
                <div className="row gap-s">
                  <div className="seg" role="radiogroup" aria-label="Choice quality">
                    {['helpful', 'mixed', 'unhelpful'].map(q => (
                      <button key={q} type="button" role="radio" aria-checked={c.quality === q} className={c.quality === q ? 'on' : ''} onClick={() => setChoice(i, 'quality', q)}>{Q_LABEL[q]}</button>
                    ))}
                  </div>
                  {form.choices.length > 2 && <button type="button" className="icon-btn" aria-label="Remove choice" onClick={() => set('choices', form.choices.filter((_, j) => j !== i))}><Icon name="trash" size={16} /></button>}
                </div>
              </div>
              <label className="field"><span className="field-label">What the student does or says</span><input value={c.text} onChange={e => setChoice(i, 'text', e.target.value)} maxLength={200} required /></label>
              <label className="field"><span className="field-label">What happens next</span><textarea rows={2} value={c.reaction} onChange={e => setChoice(i, 'reaction', e.target.value)} maxLength={400} required /></label>
              <label className="field"><span className="field-label">How the other person might feel</span><input value={c.feel} onChange={e => setChoice(i, 'feel', e.target.value)} maxLength={300} /></label>
              <label className="field"><span className="field-label">Why this helps or causes problems (kind explanation)</span><textarea rows={2} value={c.why} onChange={e => setChoice(i, 'why', e.target.value)} maxLength={400} /></label>
              <label className="field"><span className="field-label">Something else to try (optional)</span><input value={c.alternatives[0] || ''} onChange={e => setChoice(i, 'alternatives', [e.target.value])} maxLength={200} /></label>
            </section>
          ))}
          {form.choices.length < 4 && <button type="button" className="btn ghost" onClick={() => set('choices', [...form.choices, BLANK_CHOICE('mixed')])}><Icon name="plus" size={16} /> Add a choice</button>}

          <section className="card stack">
            <label className="field"><span className="field-label">Reflection question</span><input value={form.reflect} onChange={e => set('reflect', e.target.value)} placeholder="What would you do if this happened to you?" maxLength={200} /></label>
          </section>
          {error && <div className="form-error" role="alert">{error}</div>}
          <div className="row gap-s">
            <button className="btn primary big" disabled={busy}>{busy ? 'Saving…' : 'Save scenario'}</button>
            <Link to="/teacher/scenarios" className="btn ghost">Cancel</Link>
          </div>
        </div>

        <aside className="editor-preview">
          <div className="card preview-card">
            <span className="eyebrow">Student preview</span>
            <div className="stage small-stage">
              <Scene name={form.scene} />
              <div className="stage-cast"><div className="actor speaking"><Character look={CAST[form.who]} emotion={form.emotion} size={110} flip /></div></div>
            </div>
            <h3>{form.title || 'Untitled scenario'}</h3>
            <p className="small">{form.intro || 'Your narration will appear here.'}</p>
            {form.line && <div className="line speech"><span className="who">{CAST[form.who]?.name}</span><span>{form.line}</span></div>}
            <div className="choices">
              {form.choices.map((c, i) => (
                <div key={i} className="choice static"><span className="choice-key">{String.fromCharCode(65 + i)}</span><span>{c.text || '…'}</span></div>
              ))}
            </div>
          </div>
        </aside>
      </form>
    </div>
  )
}
