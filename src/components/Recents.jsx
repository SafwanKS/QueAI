import React, {useRef} from 'react'

function Recents({setShowRecents, setShowDialog}) {

  const recentsWrapper = useRef(null)

  return (
    <div className="recentsContainer">
        <div ref={recentsWrapper} className="recents-wrapper">
            <div className="recents-header">
            <h2>Recents</h2>
            <div className="close-btn btn" onClick={() =>{
              recentsWrapper.current.classList.add("hide")
              setTimeout(()=>{
                setShowRecents(false)

              }, 200)
              }} >
                <span className="material-symbols-outlined">close</span>
            </div>
            </div>
            <div className="recents-body">
            
            </div>
        </div>
    </div>
  )
}

export default Recents