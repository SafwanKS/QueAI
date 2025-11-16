import '../css/Toolbar.css'
export default function Toolbar({activityName}){
  return(
    <div className="toolbar">
      <h1>{activityName}</h1>
    </div>
  )
}
