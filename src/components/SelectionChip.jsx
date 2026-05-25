import '../css/SelectionChip.css'

import { Globe, Cpu } from 'lucide-react'

export default function SelectionChip({ onClick, icon, active, body }) {
  return (
    <div className={`chip ${active && "active"}`} onClick={onClick}>
      {icon === 'globe' ? (
        <Globe size={15} />
      ) : icon === 'cpu' ? (
        <Cpu size={15} />
      ) : (
        <span className="material-symbols-outlined">{icon}</span>
      )}
      <p>{body}</p>
      <span className='material-symbols-outlined'>keyboard_arrow_down</span>
    </div>
  )
}