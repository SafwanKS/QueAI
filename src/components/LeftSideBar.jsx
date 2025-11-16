import React , {forwardRef} from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import '../css/Sidebar.css'
import Logo from '../assets/logosmall.png';

import GlobalTooltip from "./GlobalTooltip";

const LeftSideBar = forwardRef(({
  leftSidebarRef,
  drawerCollapsed,
  setDrawerCollapsed,
  searched,
  onSearch,
  isLoggedIn,
  setShowSettings,
  recentsChats,
  setChatMessages,
  setMessages,
  shouldSaveChat,
  introRef,
  toolsRef,
  headerRef,
  rightSidebarRef,
  homeContainerRef,
  searchContainerRef,
  searchBoxRef,
  setSearched,
  resultRef,
  handleClearChat,
  showStoriesWindow,
  showCanvasWindow,
  showLessonsWindow,
  setDrawerOpened
}, ref) =>{

  const [emptyChats, setEmptyChats] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const [showTitle, setShowTitle] = useState(false)

  useEffect(()=>{
    setTimeout(()=>{
      setShowLoading(false)
      setEmptyChats(true)
    }, 2000)
  }, [clearTimeout()])


  useEffect(()=>{
    
  }, [])  
  
 
  return (
    <div ref={ref} className={`left-sidebar ${!(window.innerWidth < 768) ? (drawerCollapsed && "collapsed") : ""}`} style={{
      // display: window.innerWidth < 768 && onSearch ? "none" : "flex",
      position: window.innerWidth < 768 && "absolute",
      left: window.innerWidth < 768 && "0",
      background: (window.innerWidth < 768 || (searched && drawerCollapsed)) && ""
    }} >
      <div className="left-sidebar-header">
        <img src={Logo} alt="logo" />
        <div className="sidebar-collapse-btn btn" title={`${drawerCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}`} onClick={()=> {
          if(window.innerWidth > 768){
            setDrawerCollapsed(!drawerCollapsed)
           } else{
            ref.current.classList.remove("open")
            setDrawerOpened(false)
           }
          }} >
          <span className="material-symbols-outlined">{drawerCollapsed ? "left_panel_open" : "left_panel_close"}</span>
        </div>
      </div>
      <div className="left-sidebar-body">
        <div className="new_chat_button" onClick={(e)=> {
          handleClearChat()
            e.target.style.opacity = "0.7"
            setTimeout(() => {
              e.target.style.opacity = "1"
            }, 200);
          }
        }>
          <span className="material-symbols-outlined">add</span>
          <p>New chat</p>
        </div>
        <div className="gallery_btn" onClick={(e)=> {
          showCanvasWindow()
            e.target.style.opacity = "0.7"
            setTimeout(() => {
              e.target.style.opacity = "1"
            }, 200);
          }
        }>
          <span className="material-symbols-outlined">animated_images</span>
          <p>Canvas</p>
        </div>
        <div className="stories_btn" onClick={(e)=> {
          showStoriesWindow()
            e.target.style.opacity = "0.7"
            setTimeout(() => {
              e.target.style.opacity = "1"
            }, 200);
          }
        }>
          <span className="material-symbols-outlined">auto_stories</span>
          <p>Stories</p>
        </div>
        <div className="lessons_btn" onClick={(e)=> {
          showLessonsWindow()
            e.target.style.opacity = "0.7"
            setTimeout(() => {
              e.target.style.opacity = "1"
            }, 200);
          }
        }>
          <span className="material-symbols-outlined">school</span>
          <p>Lessons</p>
        </div>
        <div className="recent-chats">
          <h3>Recents</h3>
          <div className="recent-chats-container">
            {
              !isLoggedIn ?
              <>
                <div className="no-recents">
                  <span className="material-symbols-outlined">history</span>
                  <h4>Login to see your recent chats</h4>
                </div>
              </>
              :
              (
                recentsChats && recentsChats.length > 0 ? (
                recentsChats.map((chat, index) =>(
                  <div className='recentChatItem' onClick={(e)=>{
                    shouldSaveChat.current = false
                    setChatMessages(chat.messages)
                    e.target.style.opacity = "0.7"
                    setTimeout(() => {
                      e.target.style.opacity = "1"
                    }, 200);
                  }}>
                    <p>{chat.title}</p>
                    <div className="more">
                      <span className="material-symbols-outlined">more_horiz</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No recent chats</p>
              )
              )
            }
          </div>
        </div>
      </div>
      <div className="sidebar-footer">
        <div className="setting-btn" onClick={()=> setShowSettings(true)}>
          <span className="material-symbols-outlined">settings</span>
          <p>Settings</p>
        </div>
      </div>
    </div>
  )


})

export default LeftSideBar