import '../css/SelectionChip.css'

export default function SelectionChip({onClick, icon, active, body}){
  return(
    <div className={`chip ${active && "active"}`} onClick={onClick} >
      <span className='material-symbols-outlined'>{icon}</span>
      <p>{body}</p>
    </div>
  )
}