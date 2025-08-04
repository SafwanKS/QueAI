import React, {useRef} from 'react'

function Recents({setShowRecents, setShowDialog, recentsChats, setChatMessages}) {

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
            {
              
              recentsChats && recentsChats.length > 0 ? (
                recentsChats.map((chat, index) =>(
                  <div className='recentChatItem' onClick={()=>{
                    setChatMessages(chat.messages)
                    recentsWrapper.current.classList.add("hide")
                    setTimeout(()=>{
                      setShowRecents(false)
                    }, 200)
                  }}>
                    <p>{chat.title}</p>
                  </div>
                ))
              ) : (
                <p>No recent chats</p>
              )
            }
            </div>
        </div>
    </div>
  )
}

export default Recents