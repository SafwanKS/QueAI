import React, { forwardRef } from 'react'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
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
  setDrawerOpened,
  showLibraryWindow,
  setShowLoginDialog,
  openedChatID,
  setOpenedChatID
}, ref) => {

  const [emptyChats, setEmptyChats] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const [showTitle, setShowTitle] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      setShowLoading(false)
      setEmptyChats(true)
    }, 2000)
  }, [clearTimeout()])


  useEffect(() => {

  }, [])


  return (
    <div ref={ref} className={`left-sidebar ${!(window.innerWidth < 768) ? (drawerCollapsed && "collapsed") : ""}`} style={{
      // display: window.innerWidth < 768 && onSearch ? "none" : "flex",
      position: window.innerWidth < 768 && "absolute",
      left: window.innerWidth < 768 && "0",
      background: (window.innerWidth < 768 || (searched && drawerCollapsed)) && ""
    }} >
      <div className="left-sidebar-header">
        <img src={Logo} alt="logo" onClick={() => {
          handleClearChat()
          navigate('/')
        }} />
        <div className="sidebar-collapse-btn btn" title={`${drawerCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}`} onClick={() => {
          if (window.innerWidth > 768) {
            setDrawerCollapsed(!drawerCollapsed)
          } else {
            ref.current.classList.remove("open")
            setDrawerOpened(false)
          }
        }} >
          <span className="material-symbols-outlined">{drawerCollapsed ? "left_panel_open" : "left_panel_close"}</span>
        </div>
      </div>
      <div className="left-sidebar-body">
        <div className="nav-buttons">
          <div className={`new_chat_button ${openedChatID == "" && "active"}`} onClick={(e) => {
            handleClearChat()
            navigate('/')
            e.target.style.opacity = "0.7"
            setTimeout(() => {
              e.target.style.opacity = "1"
            }, 200);
          }
          }>
            <span className="material-symbols-outlined">edit_square</span>
            <p>New chat</p>
            <div className="gap"></div>
            {
              window.innerWidth > 768 &&
              <div className="keys">
                <p>CTRL</p>
                <p>Shift</p>
                <p>o</p>
              </div>
            }

          </div>
          <div className="gallery_btn" onClick={(e) => {
            showCanvasWindow()
            setDrawerOpened(false)
            ref.current.classList.remove("open")
            e.target.style.opacity = "0.7"
            setTimeout(() => {
              e.target.style.opacity = "1"
            }, 200);
          }
          }>
            <span className="material-symbols-outlined">animated_images</span>
            <p>Gallery</p>
          </div>
          <div className="stories_btn" onClick={(e) => {
            // showStoriesWindow()
            e.target.style.opacity = "0.7"
            setTimeout(() => {
              e.target.style.opacity = "1"
            }, 200);
          }
          }>
            <span className="material-symbols-outlined">code</span>
            <p>Projects</p>
          </div>
          <div className="lessons_btn" onClick={(e) => {
            if (!isLoggedIn) {
              setShowLoginDialog(true)
              return
            };
            showLibraryWindow()
            setDrawerOpened(false)
            ref.current.classList.remove("open")
            e.target.style.opacity = "0.7"
            setTimeout(() => {
              e.target.style.opacity = "1"
            }, 200);
          }
          }>
            <span className="material-symbols-outlined">folder</span>
            <p>Collections</p>
          </div>
        </div>
        <div className="recent-chats">
          <h3>Recents</h3>
          <div className="recent-chats-container">
            {
              !isLoggedIn ?
                <>
                  <div className="no-recents">
                    <span className="material-symbols-outlined">history</span>
                    <p>Login to see your recent chats</p>
                  </div>
                </>
                :
                (
                  recentsChats && recentsChats.length > 0 ? (
                    recentsChats.map((chat, index) => (
                      <div key={index} className={`recentChatItem ${chat.id === openedChatID && "active"}`} onClick={(e) => {
                        setOpenedChatID(chat.id)
                        shouldSaveChat.current = false
                        setChatMessages(chat)
                        navigate(`/chat/${chat.id}`)
                        setDrawerOpened(false)
                        ref.current.classList.remove("open")
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
                    <p style={{
                      padding: "0 10px"
                    }}>No recent chats</p>
                  )
                )
            }
          </div>
        </div>
      </div>
      <div className="sidebar-footer">
        <div className="setting-btn" onClick={() => {
          navigate({ hash: "#settings" })
        }
        }>
          <span className="material-symbols-outlined">settings</span>
          <p>Settings</p>
        </div>
      </div>
    </div>
  )


})

export default LeftSideBar