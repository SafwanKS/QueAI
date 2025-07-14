import '../css/SmallBtn.css'
export default function SmallBtn(props){
  return(
    <div className={`smallBtn ${props.className} ${props.bgcolor} ${props.state}`} onClick={props.onClick}>
      <span className="material-symbols-outlined">{props.icon}</span>
    </div>
    )
}