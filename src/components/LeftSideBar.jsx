import React , {forwardRef} from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import '../css/Sidebar.css'
import Logo from '../assets/logosmall.png';

const LeftSideBar = forwardRef(({
  leftSidebarRef,
  drawerCollapsed,
  setDrawerCollapsed,
  searched,
  onSearch,
  isLoggedIn,
  setShowSettings,
  recentsChats
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
    <div ref={ref} className={`left-sidebar ${!(window.innerWidth < 768) ? (drawerCollapsed && "collapsed") : "closed"}`} style={{
            display: window.innerWidth < 768 && onSearch ? "none" : "flex",
            position: window.innerWidth < 768 && "absolute",
            left: window.innerWidth < 768 && "0",
            background: (window.innerWidth < 768 || (searched && drawerCollapsed)) && "rgba(13, 13, 15, 0.9)",
            backdropFilter: window.innerWidth < 768 && "20px",
            zIndex: "10000",

          }} >
      <div className="left-sidebar-header">
        <img src={Logo} alt="logo" />
        <div className="sidebar-collapse-btn btn"  onClick={()=> {
          window.innerWidth > 768 ?
          setDrawerCollapsed(!drawerCollapsed)
          : ref.current.classList.add("closed")
          }} >
          <span className="material-symbols-outlined">{drawerCollapsed ? "left_panel_open" : "left_panel_close"}</span>
        </div>
      </div>
      <div className="left-sidebar-body">
        <div className="new_chat_button">
          <span className="material-symbols-outlined">add</span>
          <p>New chat</p>
        </div>
        <div className="recent-chats">
          <h3>Recents</h3>
          <div className="recent-chats-container">
            {
              !isLoggedIn &&
              <>
                <div className="no-recents">
                  <span className="material-symbols-outlined">history</span>
                  <h4>Login to see your recent chats</h4>
                </div>
              </>
            }

            {
              
              recentsChats && recentsChats.length > 0 ? (
                recentsChats.map((chat, index) =>(
                  <div>
                    {chat.title}
                  </div>
                ))
              ) : (
                <p>No recent chats</p>
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