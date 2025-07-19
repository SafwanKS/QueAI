import React, {useState, useEffect, useRef} from 'react'
import {signOut} from "firebase/auth";
import '../css/Settings.css'

function Settings({animations, setShowSettings, setAnimState, animState, Logo, isLoggedIn, user, setShowLoginDialog, auth, setUser, setLoginState}) {

const [selectedSettingsItem, setSelectedSettingsItem] = useState("general")

//for devices with width less than 768
const [showSettingsContent, setShowSettingsContent] = useState(false)

const settingsWrapper = useRef(null)

  return (
    <div className="settingsContainer">
        <div ref={settingsWrapper} className="settings-wrapper">
            <div className="settings-header">
                <h2 className={`settingsTitle ${window.innerWidth < 768 && (showSettingsContent && "hide")}`}>Settings</h2>
                {
                    window.innerWidth < 768 && (showSettingsContent && 
                    <div className='settings-back'>
                        <div className="back-btn" onClick={()=> setShowSettingsContent(false)}>
                            <span className="material-symbols-outlined">arrow_back</span>
                        </div>
                        <h2>{selectedSettingsItem}</h2>
                    </div>)

                }
                <div className="close-btn btn" onClick={() =>
                    {
                        settingsWrapper.current.classList.add("hide")
                        setTimeout(() => {
                            setShowSettings(false) 
                        }, 200);
                        
                    }} >
                    <span className="material-symbols-outlined">close</span>
                </div>
            </div>
            <div className="settings-body">
                <div className={`settingsMenuContainer ${showSettingsContent && "hide"}`}>
                    <div className={`settings-menu-item ${selectedSettingsItem === "general" && "active"}`}  onClick={()=> {
                        setSelectedSettingsItem("general")
                        window.innerWidth < 768 && setShowSettingsContent(true)
                        }} >
                            {/* <span className="material-symbols-outlined">settings</span> */}
                            <h4>General</h4>
                        </div>
                    <div className={`settings-menu-item ${selectedSettingsItem === "animation" && "active"}`} onClick={()=> {
                        setSelectedSettingsItem("animation")
                        window.innerWidth < 768 && setShowSettingsContent(true)
                        }}>
                            {/* <span className="material-symbols-outlined">resume</span> */}
                            <h4>Animations</h4>
                        </div>
                    <div className={`settings-menu-item ${selectedSettingsItem === "datacontrols" && "active"}`} onClick={()=> {
                        setSelectedSettingsItem("datacontrols")
                        window.innerWidth < 768 && setShowSettingsContent(true)
                        }}>
                            {/* <span className="material-symbols-outlined">database</span> */}
                            <h4>Data controls</h4>
                        </div>
                    <div className={`settings-menu-item ${selectedSettingsItem === "about" && "active"}`}  onClick={()=> {
                        setSelectedSettingsItem("about")
                        window.innerWidth < 768 && setShowSettingsContent(true)
                        }}>
                            {/* <span className="material-symbols-outlined"> </span> */}
                            <h4>About</h4>
                        </div>
                </div>
                <div className={`settingsContentContainer ${showSettingsContent ? "showContent" : "hideContent"}`}>
                    {
                        selectedSettingsItem == "general" && 
                        <div className='general'>
                            <h3>Account</h3> 

                            <div className="accountContainer">
                                <div className="profileContainer">
                                    {
                                        isLoggedIn && user ? (
                                            <img src={user.photoURL} style={{
                                                height: "40px",
                                                width: "40px",
                                                borderRadius: "50%"
                                            }}/>
                                        ) : (
                                            <span className="material-symbols-outlined">account_circle</span>
                                        )
                                    }
                                    
                                </div>
                                <div className="infoContainer">
                                    <h4>
                                        {
                                            isLoggedIn && user ? user.displayName : "Sign-in into Que AI"
                                        }
                                    </h4>
                                    <p>
                                        {
                                            isLoggedIn && user ? user.email : "Sign in to save your chats"
                                        }
                                    </p>
                                </div>
                                <div className="buttonContainer" onClick={()=>{
                                    if(isLoggedIn && user){
                                        (async ()=>{
                                            await signOut(auth)
                                            setUser(null)
                                            setLoginState(false)
                                        })()
                                    }else{
                                        setShowLoginDialog(true)
                                    }
                                }}>
                                    <div className="login-btn">
                                    {
                                        isLoggedIn ? "Sign out" : "Sign in"
                                    }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        selectedSettingsItem == "animation" &&  
                        <div className='animations'>
                            <div className="settings-item">
                                <p className="item-name">Animations</p>
                                <div className={`switch ${animations && "active"}`} onClick={() => setAnimState(!animState)} >
                                    <div className="switch-btn"></div>
                                </div>
                            </div>
                            <div className="settings-item">
                                <p className="item-name">Custom animation colour</p>
                                <div className={`switch ${animations && "active"}`} onClick={() => setAnimState(!animState)} >
                                    <div className="switch-btn"></div>
                                </div>
                            </div>
                        </div>
                    }

                    {
                        selectedSettingsItem == "about" &&  
                        <div className='about'>
                            <div className="about-logo">
                                <div>
                                    <img src={Logo} alt="" />
                                    <h1>Que AI</h1>
                                </div>
                                <div><p>Beta v0.1</p></div>   
                            </div>
                            <div className="about-author">
                                <div className="dvlpr">
                                    <p>An  open - source AI chatbot application designed & developed by <a href='https://github.com/SafwanKS' onClick={(e)=> {
                                    e.preventDefault()
                                    window.open("https://github.com/SafwanKS")
                                    }}>Safwan KS</a></p>
                                </div>
                            </div>
                        </div>
                    }

                </div>
                {/* <div className="settings-item">
                        <p className="item-name">Animations</p>
                        <div className={`switch ${animations && "active"}`} onClick={() => setAnimState(!animState)} >
                        <div className="switch-btn"></div>
                    </div>
                </div>
                <div className="settings-item">
                    <p className="item-name">Enter is send</p>
                    <div className={`switch ${animations && "active"}`} onClick={() => setAnimState(!animState)} >
                    <div className="switch-btn"></div>
                    </div>
                </div> */}
            </div>
        </div>
    </div>
  )
}

export default Settings