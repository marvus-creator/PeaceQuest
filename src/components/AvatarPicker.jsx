import Character from './Character.jsx'
import { AVATAR_OPTIONS } from '../../shared/cast.js'

const HAIR_NAMES = { short: 'Short', curly: 'Curly', puffs: 'Puffs', long: 'Long', braids: 'Braids', bob: 'Bob', bun: 'Bun', messy: 'Spiky', buzz: 'Buzz' }
const EXTRA_NAMES = { none: 'None', glasses: 'Glasses', cap: 'Cap', headband: 'Headband', freckles: 'Freckles' }

function Swatches({ label, keyName, value, onChange }) {
  return (
    <div className="picker-row">
      <div className="picker-label">{label}</div>
      <div className="swatches" role="radiogroup" aria-label={label}>
        {AVATAR_OPTIONS[keyName].map(c => (
          <button key={c} type="button" role="radio" aria-checked={value === c} aria-label={`${label} ${c}`} className={`swatch ${value === c ? 'on' : ''}`} style={{ background: c }} onClick={() => onChange(c)} />
        ))}
      </div>
    </div>
  )
}

export default function AvatarPicker({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v })
  return (
    <div className="avatar-picker">
      <div className="avatar-preview">
        <Character look={value} emotion="happy" size={180} />
      </div>
      <div className="avatar-controls">
        <Swatches label="Skin" keyName="skin" value={value.skin} onChange={v => set('skin', v)} />
        <div className="picker-row">
          <div className="picker-label">Hair</div>
          <div className="chips">
            {AVATAR_OPTIONS.hair.map(h => (
              <button key={h} type="button" className={`chip ${value.hair === h ? 'on' : ''}`} onClick={() => set('hair', h)}>{HAIR_NAMES[h]}</button>
            ))}
          </div>
        </div>
        <Swatches label="Hair colour" keyName="hairColor" value={value.hairColor} onChange={v => set('hairColor', v)} />
        <Swatches label="Shirt" keyName="shirt" value={value.shirt} onChange={v => set('shirt', v)} />
        <div className="picker-row">
          <div className="picker-label">Extra</div>
          <div className="chips">
            {AVATAR_OPTIONS.extra.map(x => (
              <button key={x} type="button" className={`chip ${value.extra === x ? 'on' : ''}`} onClick={() => set('extra', x)}>{EXTRA_NAMES[x]}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
