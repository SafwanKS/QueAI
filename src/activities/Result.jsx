import React, { useEffect, useState, forwardRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from '../firebase.js'
import {getTitle} from '../Gemini.js'
import '../css/LoadingBar.css'
import { useRef } from "react";
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
  toolName,
  setShowSources,
  setSources
}, ref) => {

  const [showModelSelect, setShowModeSelect] = useState(false)

  const [title, setTitle] = useState('');

  const titlesObserverRef = useRef(null)




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
      setShowToast(true)
      setToastText("Sharing is not available in your browser")
      setTimeout(() => {
        if (toastRef && toastRef.current) toastRef.current.classList.add("hide")
        setShowToast(false)
      }, 4000);
    }
  }

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setShowToast(true)
      setToastText("Copied to clipboard")
      setTimeout(() => {
        if (toastRef && toastRef.current){
          toastRef.current.classList.add("hide")
          setTimeout(() => {
            setShowToast(false)
          }, 1000);
        } 
      }, 3000);
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

  function convertToJson(text) {
    try {
      let fixedText = text
        .replace(/'/g, '"')
        .replace(/"(\w+?)":/g, '"$1":');
        console.log(fixedText);
      let obj = JSON.parse(fixedText);
      
      if (obj.data && typeof obj.data === 'string') {
        try {
          obj.data = JSON.parse(obj.data);
        } catch (e) {
          // console.log(e);
        }
      }
      return obj;
    } catch (e) {
      // console.error("Failed to convert text to JSON:", e.message);
      return null;
    }
}


  const showResponse = (item) =>{
    if(item){
      if(item.type === "chat" || item.type === "lesson"){
        if(item.ans.startsWith("{")){
          const ansJson = convertToJson(item.ans)
          console.log(ansJson);
          return(item.ans)
          // return (ansJson.data.content)
          if(ansJson.data && ansJson.data.content){
            return (ansJson.data.content)
          }
        }else return(item.ans)
      }
      if(item.type === "story"){
        return(item.content)
      }
    }
  }



    useEffect(() => {
      // disconnect previous observer if present
      if (titlesObserverRef.current) {
        titlesObserverRef.current.disconnect()
        titlesObserverRef.current = null
      }

      // get all titles inside this component's DOM (scoped to result element if needed)
      // using document is ok here because this component structure is unique; if you have multiple instances consider scoping to a container ref
      const titleNodes = Array.from(document.querySelectorAll('.result .list-title'))
      if (!titleNodes || titleNodes.length === 0) return

      const observer = new IntersectionObserver((entries) => {
        // pick the entry with the largest intersectionRatio that isIntersecting
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length > 0) {
          const best = visible[0].target
          const newTitle = best.dataset.title || best.textContent || ''
          setTitle(prev => {
            if (prev !== newTitle) return newTitle
            return prev
          })
        }
        // If nothing is intersecting we keep previous title (you can clear it by else setTitle(''))
      }, {
        // tweak thresholds / rootMargin to change when titles are considered "in view"
        threshold: [0, 0.25, 0.5, 0.75, 1]
      })

      // observe each node
      titleNodes.forEach(node => observer.observe(node))

      titlesObserverRef.current = observer

      // cleanup
      return () => {
        if (titlesObserverRef.current) {
          titlesObserverRef.current.disconnect()
          titlesObserverRef.current = null
        }
      }
      // re-run effect whenever the underlying items change
    }, [itemName?.length, toolMode, toolName, messages.length, lessons.length, stories.length])

    // keep the h1 ref text in sync if you want direct DOM update (optional — state already drives UI)
    useEffect(() => {
      if (resultTitle && resultTitle.current) {
        resultTitle.current.innerText = title
      }
    }, [title, resultTitle])







  return (
    <div ref={ref} className="result">
      <div className="result-header">
        <div className="result-header-left">

          {window.innerWidth > 768 && title}

          {
            window.innerWidth < 768 && 
              <div className="back_btn btn" onClick={() => {
                handleClearChat()
              }} >
                <span className="material-symbols-outlined">arrow_back</span>
              </div>
          }
          
          {/* <h1 ref={resultTitle} ></h1> */}
        </div>
        <div className="result-header-center">
          {window.innerWidth < 768 && <p>{title}</p>}
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
              <p className="list-title" style={{
                fontSize: "28px",
                fontWeight: "500",
              }}>
                {toolMode 
                  ? toolName === "story" 
                    ? item.title 
                    : item.que
                  : item.que
                }
              </p>
              {
                !toolMode && item.sources && item.sources.length !== 0 &&
                // <div className="filters">
                //   <div className="filter active">
                //     Answer
                //   </div>
                //   <div className="filter" onClick={()=> window.open("https://www.google.com/search?tbm=isch&q=" + item.que)}>Images</div>
                  
                // </div>
                <p style={{
                  display: "flex",
                  gap: "5px",
                  alignItems: "center",
                  opacity: "0.4",
                  marginTop: "10px"
                }}><span className="material-symbols-outlined" style={{
                  fontSize: "16px"
                }}>language</span>Searched Web</p>
              }
              
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
                            {showResponse(item)}
                          </ReactMarkdown>  

                          {
                            item.sources && item.sources.length !== 0 && <div className="filter source" onClick={()=> {
                              setShowSources(true)
                              setSources(item.sources)
                            }}>
                              <div className="icon-stack">
                                {
                                  item.sources[0].favicon && <img src={item.sources[0].favicon} alt="" />
                                }
                                {
                                  item.sources[1] && item.sources[1].favicon && <img src={item.sources[1].favicon} alt="" />
                                }
                                {
                                  item.sources[2] && item.sources[2].favicon && <img src={item.sources[2].favicon} alt="" />
                                }
                              </div>
                              <p>{item.sources.length} sources</p>
                              </div>
                          }
                                                  
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
                          <div className="gap"></div>
                          
                        </div>
                        {/* <div className='line' ></div> */}
                      </>
                    )
                    :
                    (
                      <div className="loading loading01">
                        <span>A</span>
                        <span>n</span>
                        <span>s</span>
                        <span>w</span>
                        <span>e</span>
                        <span>r</span>
                        <span>i</span>
                        <span>n</span>
                        <span>g</span>
                      </div>
                    )
                }
                
              </div>
            </div>
          )
        }

        {/* {
          window.innerWidth < 768  && <>
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
        } */}

      </div>
    </div>
  );
})

export default Result;
