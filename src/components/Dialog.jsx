import '../css/Dialog.css'
import { useState, useEffect, forwardRef, useRef } from 'react'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useNavigate } from 'react-router'

function Dialog({
  type, icon, title, message, cancelTxt, confirmTxt, onCancel, onConfirm, visible, children
}) {
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    visible ? setIsVisible(true) : setIsVisible(false)
  }, [visible])
  return (
    <div className='overlay'>
      <div className={`dialog ${type === 'selection' && 'selection'} ${isVisible && 'show'} `}>
        {type === 'selection' ? <span className='material-symbols-outlined'>{icon}</span> : <></>}
        <h1 className='dTitle'>{title}</h1>
        {
          type === 'normal' ?
            <p className='dMessage'>
              {message}
            </p> : children
        }
        <div className='dButton-container'>
          <button className='dButton' id='cancelBtn' onClick={onCancel}>{cancelTxt}</button>
          <button className='dButton' id='confirmBtn' onClick={onConfirm}>{confirmTxt}</button>
        </div>
      </div>
    </div>
  )
}


const RenameDialog = forwardRef(({
  setShowRenameDialog,
  visible,
  tempChatID,
  user,
  getChats
}, ref) => {
  const chatID = tempChatID
  const [renameText, setRenameText] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const inputRef = useRef(null)
  const confirmBtn = useRef(null)
  useEffect(() => {
    visible ? setIsVisible(true) : setIsVisible(false)
  }, [visible])

  useEffect(() => {
    (async () => {
      if (!chatID) return
      const chat = await getDoc(doc(db, "users", user.uid, "chats", chatID))
      setRenameText(chat.data().title)
      setTimeout(() => {
        inputRef.current.select()
      }, 10)
    })()
  }, [chatID, user])

  const renameChat = async () => {
    await setDoc(doc(db, "users", user.uid, "chats", chatID), {
      title: renameText
    }, { merge: true })
  }

  return (
    <div className="overlay">
      <div className={`rename-dialog ${isVisible && "show"}`}>
        <div className="rename-dialog-header">
          <h1 className="rename-dialog-title">Rename Chat</h1>
        </div>
        <div className="rename-dialog-body">
          <input ref={inputRef} autoFocus type="text" className="rename-dialog-input" value={renameText} onChange={(e) => setRenameText(e.target.value)} onFocus={(e) => {
            e.target.select()
          }}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                confirmBtn.current.click()
              }
            }}
          />
        </div>
        <div className="rename-dialog-footer">
          <button className="rename-dialog-cancel-btn" onClick={() => setShowRenameDialog(false)}>Cancel</button>
          <button className="rename-dialog-confirm-btn" ref={confirmBtn} onClick={async (e) => {
            e.target.style.opacity = 0.5
            e.target.innerHTML = "Saving"
            await renameChat()
            setTimeout(() => {
              e.target.style.opacity = 1
              setShowRenameDialog(false)
            }, 200);
            await getChats(user)
          }}>Save</button>
        </div>
      </div>
    </div>
  )
})


const DeleteDialog = forwardRef(({
  setShowDeleteDialog,
  visible,
  tempChatID,
  user,
  getChats
}, ref) => {
  const chatID = tempChatID
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    visible ? setIsVisible(true) : setIsVisible(false)
  }, [visible])


  const deleteChat = async () => {
    await deleteDoc(doc(db, "users", user.uid, "chats", chatID))
    navigate("/")
  }

  return (
    <div className="overlay">
      <div className={`delete-dialog ${isVisible && "show"}`}>
        <div className="delete-dialog-header">
          <h1 className="delete-dialog-title">Delete Chat</h1>
        </div>
        <div className="delete-dialog-body">
          <p className="delete-dialog-message">Are you sure you want to delete this chat?</p>
        </div>
        <div className="delete-dialog-footer">
          <button className="delete-dialog-cancel-btn" onClick={() => setShowDeleteDialog(false)}>Cancel</button>
          <button className="delete-dialog-confirm-btn" onClick={async (e) => {
            e.target.style.opacity = 0.5
            e.target.innerHTML = "Deleting"
            await deleteChat()
            setTimeout(() => {
              setShowDeleteDialog(false)
            }, 200)
            await getChats(user)
          }}>Delete</button>
        </div>
      </div>
    </div>
  )
})

const InfoDialog = forwardRef(({
  setShowInfoDialog,
  visible,
  tempChatID,
  user
}, ref) => {
  const chatID = tempChatID
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    visible ? setIsVisible(true) : setIsVisible(false)
  }, [visible])
  const [chat, setChat] = useState(null)
  const getChat = async () => {
    const chat = await getDoc(doc(db, "users", user.uid, "chats", chatID))
    setChat(chat.data())
  }
  useEffect(() => {
    getChat()
  }, [chatID, user])
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }
  return (
    <div className="overlay">
      <div className={`info-dialog ${isVisible && "show"}`}>
        <div className="info-dialog-header">
          <h1 className="info-dialog-title">
            <span className="material-symbols-outlined">info</span>
            Chat Info
          </h1>
        </div>
        <div className="info-dialog-body">
          <p className="info-dialog-message">
            Title: &nbsp; {chat?.title}
          </p>
          <p className="info-dialog-message">
            Created At: &nbsp; {formatTimestamp(chat?.timestamp)}
          </p>
          <p className="info-dialog-message">
            Last Updated: &nbsp; {formatTimestamp(chat?.timestamp)}
          </p>
        </div>
        <div className="info-dialog-footer">
          <button className="info-dialog-confirm-btn" onClick={() => setShowInfoDialog(false)}>OK</button>
        </div>
      </div>
    </div>
  )
})

export { Dialog, RenameDialog, DeleteDialog, InfoDialog }
