import { useState, useEffect, forwardRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase.js'
import '../css/Header.css'
import Logo from '../assets/logosmall.png'
import Avatar from '../assets/avatar.png'
import SmallBtn from './SmallBtn.jsx'
import GlobalTooltip from "./GlobalTooltip";
import { useRef } from 'react'
import { Search, Settings, Bug, LogOut, Equal } from 'lucide-react'
const Header = forwardRef(({
  searched,
  headerRef,
  drawerCollapsed,
  setDrawerCollapsed,
  leftSidebarRef,
  isLoggedIn,
  setShowRecents,
  setShowSettings,
  setShowLoginDialog,
  user,
  setLoginState,
  setShowDialog,
  setShowCusAI,
  setAnimations,
  animations,
  setAnimState,
  animState,
  handleClearChat,
  setDrawerOpened,
  setShowToast,
  setToastText,
  toastRef,
  setShowSearchChats
}, ref) => {
  const navigate = useNavigate()
  const [route,
    setRoute] = useState("/")
  const location = useLocation()
  useEffect(() => {
    setRoute(location.pathname)
  }, [location])

  const [showProfileInfo, setShowProfileInfo] = useState(false)
  const profileInfoRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileInfoRef.current && !profileInfoRef.current.contains(e.target)) {
        setShowProfileInfo(false)
      }
    }
    document.addEventListener("click", handleOutsideClick)
    return () => document.removeEventListener("click", handleOutsideClick)
  }, [])

  const iconProps = { size: 18, strokeWidth: 1.8 }

  const TwoLineMenu = ({ size = 23, color = "currentColor", strokeWidth = 1.8 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
    </svg>
  )


  return (

    <div ref={ref} className="header invisible" style={{
      padding: !drawerCollapsed && "0 40px"
    }}>
      <GlobalTooltip />
      <div className="firstCol">
        {
          window.innerWidth < 768 && !searched &&
          <div className='btn menu-btn' onClick={() => {
            leftSidebarRef.current.classList.add("open")
            setDrawerOpened(true)
          }}>
            {/* <span className="material-symbols-outlined">menu</span> */}
            <Equal size={26} />
          </div>
        }
        {/* <h1>Que AI</h1> */}
        {/* <h2>Que AI</h2> */}
        {
          user && user !== null &&
          <p style={{
            fontSize: "26px",
            fontWeight: "600"
          }}>Que AI <span style={{ fontSize: "14px", color: "grey", fontWeight: "400" }}>Beta</span></p>
        }

      </div>
      <div className="secondCol">
        {
          user && isLoggedIn && (
            <div className="searchBar" onClick={() => setShowSearchChats(true)}>
              {/* <span className="material-symbols-outlined">search</span> */}
              <Search size={15} />
              <p>Search Chats</p>
              <div className="keys">
                <p>CTRL</p>
                <p>K</p>
              </div>
            </div>
          )
        }
        {/* <div className="btn animation" data-title='Toggle animation (Ctrl + u)' onClick={()=>{
              setAnimState(!animState)
            }} >
              <span className="material-symbols-outlined">animation</span>
            </div> */}
        {
          !isLoggedIn ?
            <div className='login-btn' onClick={() => setShowLoginDialog(true)}>
              {/* <img src={Avatar} alt="" /> */}
              {/* <span className="material-symbols-outlined">account_circle</span> */}
              <p>Sign in</p>
            </div>
            :
            <>

              {/* <div className="btn recents" data-title='Recents' onClick={()=>{
              setShowDialog(true)
               setShowRecents(true)
            }} >
              <span className="material-symbols-outlined">history</span>
            </div> */}
              <div className="profile-container" ref={profileInfoRef} onClick={() => setShowProfileInfo(true)}>
                <img src={user.photoURL} alt="profile" />
                <p className='profileName'>{user.displayName.split(" ")[0]}</p>
                {
                  showProfileInfo &&
                  <div className="profileInfo">
                    <div className="profileInfoHeader">
                      <div className="closeBtn" onClick={(e) => {
                        e.stopPropagation()
                        setShowProfileInfo(false)
                      }}>
                        <span className="material-symbols-outlined">close</span>
                      </div>
                    </div>
                    <div className='accDetails'>
                      <div className='profilePic'>
                        <img src={user.photoURL} alt="" style={{
                          width: "50px",
                          height: "50px",
                          marginTop: "5px"
                        }} />
                      </div>
                      <div className='info'>
                        <h4>{user.displayName}</h4>
                        <p>{user.email}</p>
                      </div>

                    </div>
                    {/* <div className="customize-button pbtn" onClick={() => setShowCusAI(true)}>
                      <span className="material-symbols-outlined">chat_bubble</span>
                      <p>Customize Que AI</p>
                    </div> */}
                    <div className="settings-button pbtn" onClick={() => {
                      navigate("/#settings")
                    }}>
                      <Settings {...iconProps} />
                      <p>Settings</p>
                    </div>
                    <div className="feedback-button pbtn" onClick={() => {
                      window.open("https://github.com/SafwanKS/QueAI/issues/new")
                      setShowProfileInfo(false)
                    }}>
                      <Bug {...iconProps} />
                      <p>Report a bug</p>
                    </div>
                    <div className="logout-button pbtn" onClick={async () => {
                      try {
                        await signOut(auth)
                        setLoginState(false)
                        setShowToast(true)
                        setToastText("Logged out successfully.")
                        setTimeout(() => {
                          if (toastRef && toastRef.current) {
                            toastRef.current.classList.add("hide")
                            setTimeout(() => {
                              setShowToast(false)
                            }, 1000);
                          }
                        }, 3000);
                      } catch (err) {
                        setShowToast(true)
                        setToastText("Could not logout. Try again.")
                        setTimeout(() => {
                          if (toastRef && toastRef.current) {
                            toastRef.current.classList.add("hide")
                            setTimeout(() => {
                              setShowToast(false)
                            }, 1000);
                          }
                        }, 3000);
                      }
                    }}>
                      <LogOut {...iconProps} />
                      <p>Sign out</p>
                    </div>

                  </div>

                }

              </div>
            </>

        }
      </div>
    </div >
  )
})

export default Header