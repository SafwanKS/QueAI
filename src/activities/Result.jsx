import React, { useEffect, useState, forwardRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from '../firebase.js'
import {getTitle} from '../Gemini.js'
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
  shouldSaveChat,
  setMessages,
  relatedQues,
  handleButtonClick,
  handleClearChat,
  stories,
  lessons,
  toolMode,
  toolName
}, ref) => {

  const [showModelSelect, setShowModeSelect] = useState(false)

  // useEffect(()=>{
  //   if(messages[0]){
  //     const node = lastElement.current
  //     node.scrollIntoView(true)
  //   }
  // }, [relatedQues])

  useEffect(() => {
    if (messages[0]) {
      const node = lastElement.current
      if (messages[messages.length - 1].ans == "" && node) node.scrollIntoView(true)
      if (chatID !== "" && shouldSaveChat.current) {
        if (messages[messages.length - 1].ans && messages[messages.length - 1].ans !== null && messages[messages.length - 1].ans !== "") {
          (async () => {
            // const title = await getTitle(messages[0].que)
            // alert(title)
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

  useEffect(()=>{
    if(stories[0]){
      const node = lastElement.current
      if (stories[stories.length - 1].content == "" && node) node.scrollIntoView(true)
    }
  }, [stories])

  useEffect(()=>{
    if(lessons[0]){
      const node = lastElement.current
      if (lessons[lessons.length - 1].ans == "" && node) node.scrollIntoView(true)
    }
  }, [lessons])


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

  let itemName

  if(toolMode){
    if(toolName === "story") itemName = stories
    else if(toolName === "learn") itemName = lessons
  }else{
    itemName = messages
  }


  return (
    <div ref={ref} className="result">
      <div className="result-header">
        <div className="result-header-left">
          <div className="back_btn" onClick={() => {
            handleClearChat()
          }} >
            <span className="material-symbols-outlined">arrow_back</span>
          </div>
          <h1 ref={resultTitle} ></h1>
        </div>
        <div className="result-header-right">
          <div className="more_btn">
            <span className="material-symbols-outlined">more_horiz</span>
          </div>
        </div>
      </div>

      <div className="result-body">
        {
          itemName?.map((item, index) =>
            <div key={index} ref={index === (toolMode ? toolName === "story" ? stories.length : lessons.length : messages.length) - 1 ? lastElement : null} className="responseDiv">
              <h1>
                {toolMode 
                  ? toolName === "story" 
                    ? item.title 
                    : item.que
                  : item.que
                }
              </h1>
              <div className='line' ></div>
              <div id="response"
              >
                {
                          item.image && item.image.base64Data &&
                            <img src={`data:${item.image.mimeType};base64,${item.image.base64Data}`} />
                          }
                {
                  (item.ans || item.content) && (item.ans || item.content) !== "" ?
                    (
                      <>
                        <div className='resans' >
                          
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {toolMode 
                              ? toolName === "story" 
                                ? item.content 
                                : item.ans
                              : item.ans
                            }
                          </ReactMarkdown>                          
                        </div>
                        <div className={`actions ${answering || "active"}`}>
                          <div className="quickActions">
                            <div className="actionBtn action-favorite">
                              <span className="material-symbols-outlined">favorite</span>
                            </div>
                            <div className="actionBtn action-copy" onClick={() => copyText(item.ans || item.content)}>
                              <span className="material-symbols-outlined">content_copy</span>
                            </div>
                            {/* <div className="actionBtn actionMenu">
                              <span className="material-symbols-outlined">more_horiz</span>
                            </div> */}
                          </div>
                          <div className="bigActions">
                            <div className="actionBtn action-share" onClick={() => handleShare((item.que || item.title), (item.ans || item.content))}>
                              <span className="material-symbols-outlined">ios_share</span>
                              <p>Share</p>
                            </div>
                            <div className="actionBtn actionExport" onClick={() => handleSave((item.que || item.title), (item.ans || item.content))}>
                              <span className="material-symbols-outlined">save_alt</span>
                              <p>Export</p>
                            </div>
                          </div>
                        </div>
                        <div className='line' ></div>
                        {
                          window.innerWidth < 768 && <>
                            <div className={`relates-ques ${answering || "active"}`}>
                              <ul className="related-ques-list">
                                  {
                                      relatedQues !== null ?
                                          relatedQues.map((que, index) => 
                                              <li className="related-ques-item" onClick={()=> {
                                                  setTimeout(()=>{
                                                      handleButtonClick(que)
                                                  }, 100)
                                                  
                                              }} key={index}>
                                                  <p>{que}</p>
                                                  <span className="material-symbols-outlined">arrow_outward</span>
                                              </li>
                                          )
                                      : 
                                          <></>
                                  }
                                  
                              </ul>
                          </div>
                          <div className='line' ></div>
                          </>
                        }
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
