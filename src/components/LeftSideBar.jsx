import React, { forwardRef } from 'react'
import ReactDOM from 'react-dom'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import '../css/Sidebar.css'
import Logo from '../assets/logosmall.png';
import { Menu, MenuOption } from "../components/Menu.jsx";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { SquarePen, Images, Code2, FolderOpen, Settings } from 'lucide-react'
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
  showCanvasWindow,
  showLessonsWindow,
  setDrawerOpened,
  showLibraryWindow,
  setShowLoginDialog,
  openedChatID,
  setOpenedChatID,
  darkmode,
  setShowRenameDialog,
  setShowDeleteDialog,
  setShowInfoDialog,
  setTempChatID
}, ref) => {

  const [emptyChats, setEmptyChats] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const [showTitle, setShowTitle] = useState(false)
  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const [openMenuIndex, setOpenMenuIndex] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
      setEmptyChats(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])


  const handleMenuClick = (e, index) => {
    e.stopPropagation()
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const menuHeight = 150
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top

    let top = 0
    if (spaceBelow >= menuHeight) {
      top = rect.bottom + window.scrollY + 5
    } else {
      top = rect.top + window.scrollY - menuHeight - 5
    }

    setMenuPosition({ top, left: rect.left })
    setOpenMenuIndex(openMenuIndex === index ? null : index)

  }

  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuIndex(null)
    document.addEventListener("click", handleOutsideClick)
    return () => document.removeEventListener("click", handleOutsideClick)
  }, [])

  const iconProps = { size: 18, strokeWidth: 1.8 }

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
            <SquarePen {...iconProps} />
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
            <Images {...iconProps} />
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
            <Code2 {...iconProps} />
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
            <FolderOpen {...iconProps} />
            <p>Library</p>
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
                        <div className="more" onClick={(e) => {
                          handleMenuClick(e, index)
                        }}>
                          <span className="material-symbols-outlined">more_horiz</span>
                        </div>
                        {
                          openMenuIndex === index && ReactDOM.createPortal(
                            <Menu key={index} menuPosition={menuPosition} darkmode={darkmode}>
                              <MenuOption icon="edit" text="Rename" onClick={(e) => {
                                e.stopPropagation()
                                setOpenMenuIndex(null)
                                setTempChatID(chat.id)
                                setShowRenameDialog(true)
                              }} />
                              <MenuOption icon="star" text="Favourite" onClick={(e) => {
                                e.stopPropagation()
                              }} />
                              <MenuOption icon="info" text="Info" onClick={(e) => {
                                e.stopPropagation()
                                setOpenMenuIndex(null)
                                setTempChatID(chat.id)
                                setShowInfoDialog(true)
                              }} />
                              <MenuOption icon="delete" text="Delete" onClick={(e) => {
                                e.stopPropagation()
                                setOpenMenuIndex(null)
                                setTempChatID(chat.id)
                                setShowDeleteDialog(true)
                              }} />
                            </Menu>
                            , ref.current
                          )
                        }
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
          <Settings {...iconProps} />
          <p>Settings</p>
        </div>
      </div>
    </div>
  )


})

export default LeftSideBar