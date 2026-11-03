import { useState } from 'react'
import Icon from '../components/Icons.jsx'

const CHIPS = ['I would try something different next time', 'This has happened to me before', 'I learned a new idea to try', 'I need to think about this more']

export default function Reflection({ prompt, value, onChange }) {
  const [open, setOpen] = useState(!!value?.text)
  const v = value || { prompt, chip: null, text: '' }
  const set = patch => onChange({ ...v, prompt, ...patch })
  return (
    <div className="reflection">
      <div className="reflection-head">
        <Icon name="bulb" size={20} />
        <div>
          <b>Think about it</b>
          <p>{prompt}</p>
        </div>
      </div>
      <div className="chips">
        {CHIPS.map(c => (
          <button key={c} type="button" className={`chip ${v.chip === c ? 'on' : ''}`} onClick={() => set({ chip: v.chip === c ? null : c })}>{c}</button>
        ))}
      </div>
      {open ? (
        <label className="field">
          <span className="field-label">Write your thoughts (optional)</span>
          <textarea rows={3} maxLength={2000} value={v.text} onChange={e => set({ text: e.target.value })} placeholder="There are no wrong answers here." />
        </label>
      ) : (
        <button type="button" className="link small" onClick={() => setOpen(true)}>+ Write my own thoughts</button>
      )}
      <p className="private-note"><Icon name="eyeoff" size={14} /> Private: only you can read your reflections.</p>
    </div>
  )
}
