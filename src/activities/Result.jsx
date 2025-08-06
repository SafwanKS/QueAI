import React, { useEffect, useState, forwardRef } from "react";
import ReactMarkdown from 'react-markdown';
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from '../firebase.js'
import '../css/LoadingBar.css'

const Result = forwardRef(({
  introRef,
  toolsRef,
  headerRef,
  resultRef,
  leftSidebarRef,
  rightSidebarRef,
  homeContainerRef,
  searchBoxRef,
  setSearched,
  messages,
  lastElement,
  resultTitle,
  chatID,
  setChatID,
  setChats,
  getRandomString,
  chats,
  searchContainerRef,
  setShowToast,
  setToastText,
  toastRef,
  generativeModel,
  setGenerativeModel,
  answering,
  user,
  getChats,
  shouldSaveChat
}, ref) => {

  const [showModelSelect, setShowModeSelect] = useState(false)

  useEffect(() => {
    if (messages[0]) {
      const node = lastElement.current
      if (messages[messages.length - 1].ans == "" && node) node.scrollIntoView(true)
      if (chatID !== "" && shouldSaveChat.current) {
        if (messages[messages.length - 1].ans && messages[messages.length - 1].ans !== null && messages[messages.length - 1].ans !== "") {
          (async () => {
            await setDoc(doc(db, "users", user.uid, "chats", chatID), {
              title: messages[0].que,
              messages: messages,
              timestamp: Date.now()
            })
            await getChats(user)
          })()
        }
      } else {
        console.log("chat id missing")
      }
    }
  }, [messages])

  const handleSave = (title, text) => {
    const blob = new Blob([text], { type: "text/plain" })

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url;

    a.download = title + ".txt"
    a.click()

    URL.revokeObjectURL(url)
  }

  const handleShare = async (title, text) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text
        })
        console.log("shared success")
      } catch (err) {
        console.log("error while sharing " + err)
      }
    } else {
      alert("Sharing is not available on your browser/device")
    }
  }

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setShowToast(true)
      setToastText("Copied to clipboard")
      setTimeout(() => {
        if (toastRef && toastRef.current) toastRef.current.classList.add("hide")
        setShowToast(false)
      }, 2000);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div ref={ref} className="result">
      <div className="result-header">
        <div className="result-header-left">
          <div className="back_btn" onClick={() => {
            introRef.current.classList.remove("hide")
            toolsRef.current.classList.remove("hide")
            headerRef.current.classList.remove("hide")
            ref.current.classList.remove("show")
            leftSidebarRef.current.classList.remove("show")
            rightSidebarRef.current.classList.remove("show")
            homeContainerRef.current.style.paddingTop = "150px"
            searchContainerRef.current.classList.remove('onsearch')
            searchBoxRef.current.classList.add('active')
            homeContainerRef.current.classList.remove('onsearch')
            setSearched(false)
          }} >
            <span className="material-symbols-outlined">arrow_back</span>
          </div>
          <h1 ref={resultTitle} ></h1>
        </div>
        <div className="result-header-right">

          {/* <div className="modelSelect">
                        <div className="model-select-btn" onClick={()=> setShowModeSelect(!showModelSelect)} style={{
                            background: showModelSelect && "var(--dialog-bg)"
                        }}>
                            <p>Model: {generativeModel}</p>
                            <span className="material-symbols-outlined">arrow_drop_down</span>
                        </div>
                        {
                            showModelSelect &&
                            <div className="model-select-list">
                                <div className="model-select-item" onClick={()=>{
                                    setShowModeSelect(false)
                                    setGenerativeModel("2.0 Flash")
                                }}>Gemini 2.0-Flash</div>
                                <div className="model-select-item" onClick={()=>{
                                    setShowModeSelect(false)
                                    setGenerativeModel("2.5 Flash")
                                }}>Gemini 2.5-Flash</div>
                            </div>
                        }
                    </div> */}

          <div className="more_btn">
            <span className="material-symbols-outlined">more_horiz</span>
          </div>
        </div>
      </div>

      <div className="result-body">
        {
          messages.map((message, index) =>
            <div key={index} ref={index === messages.length - 1 ? lastElement : null} className="responseDiv">
              <h1>{message.que}</h1>
              <div className='line' ></div>
              <div id="response"
              >
                {
                  message.ans && message.ans !== "" ?
                    (
                      <>
                        <div className='resans markdown-output' >
                          <ReactMarkdown components={{
                            h1: ({ node, ...props }) => <h1 style={{ margin: '0.5em 0' }} {...props} />,
                            h2: ({ node, ...props }) => <h2 style={{ margin: '0.4em 0' }} {...props} />,
                            p: ({ node, ...props }) => <p style={{ margin: '0.2em 0' }} {...props} />,
                            ul: ({ node, ...props }) => <ul style={{ margin: '0.2em 0' }} {...props} />,
                            li: ({ node, ...props }) => <li style={{ margin: '0.1em 0' }} {...props} />,
                          }}>
                            {message.ans}
                          </ReactMarkdown>
                        </div>

                        <div className={`actions ${answering || "active"}`}>
                          <div className="bigActions">
                            <div className="actionBtn action-share" onClick={() => handleShare(message.que, message.ans)}>
                              <span className="material-symbols-outlined">ios_share</span>
                              <p>Share</p>
                            </div>
                            <div className="actionBtn actionExport" onClick={() => handleSave(message.que, message.ans)}>
                              <span className="material-symbols-outlined">save_alt</span>
                              <p>Export</p>
                            </div>
                          </div>
                          <div className="quickActions">
                            <div className="actionBtn action-favorite">
                              <span className="material-symbols-outlined">favorite</span>
                            </div>
                            <div className="actionBtn action-copy" onClick={() => copyText(message.ans)}>
                              <span className="material-symbols-outlined">content_copy</span>
                            </div>
                            <div className="actionBtn actionMenu">
                              <span className="material-symbols-outlined">more_horiz</span>
                            </div>
                          </div>
                        </div>
                        <div className='line' ></div>

                      </>
                    )
                    :
                    (
                      <div className='loadingBars'>
                        <div className='loadingBar' />
                        <div className='loadingBar' />
                        <div className='loadingBar' />
                      </div>
                    )
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
})

export default Result;
