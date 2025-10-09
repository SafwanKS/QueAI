import React, {useState, useEffect, useRef} from 'react'
import {signOut} from "firebase/auth";
import '../css/Settings.css'

function Settings({
    animations, 
    setShowSettings, 
    setDarkmode, 
    darkmode, 
    Logo, 
    isLoggedIn, 
    user, 
    setShowLoginDialog, 
    auth, 
    setUser, 
    setLoginState,
    customAnimEnabled,
    setCustomAnimEnabled,
    customPreferences,
    setCustomPreferences, 
    deletedata
}) {

const [selectedSettingsItem, setSelectedSettingsItem] = useState("general")

//for devices with width less than 768
const [showSettingsContent, setShowSettingsContent] = useState(false)

const settingsWrapper = useRef(null)
const cusNameRef = useRef(null)
const cusPrefRef = useRef(null)
const cusDescRef = useRef(null)

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
                <div className="close-btn btn" onClick={(e) =>
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
                    <div className={`settings-menu-item ${selectedSettingsItem === "general" && "active"}`}  onClick={(e)=> {
                        e.target.style.opacity = "0.7"
                        setTimeout(() => {
                            e.target.style.opacity = "1"
                        }, 200);
                        setSelectedSettingsItem("general")
                        window.innerWidth < 768 && setShowSettingsContent(true)
                        }} >
                            {/* <span className="material-symbols-outlined">settings</span> */}
                            <h4>General</h4>
                        </div>
                    <div className={`settings-menu-item ${selectedSettingsItem === "appearance" && "active"}`} onClick={(e)=> {
                        e.target.style.opacity = "0.7"
                        setTimeout(() => {
                            e.target.style.opacity = "1"
                        }, 200);
                        setSelectedSettingsItem("appearance")
                        window.innerWidth < 768 && setShowSettingsContent(true)
                        }}>
                            {/* <span className="material-symbols-outlined">resume</span> */}
                            <h4>Appearance</h4>
                        </div>
                    <div className={`settings-menu-item ${selectedSettingsItem === "datacontrols" && "active"}`} onClick={(e)=> {
                        e.target.style.opacity = "0.7"
                        setTimeout(() => {
                            e.target.style.opacity = "1"
                        }, 200);
                        setSelectedSettingsItem("datacontrols")
                        window.innerWidth < 768 && setShowSettingsContent(true)
                        }}>
                            {/* <span className="material-symbols-outlined">database</span> */}
                            <h4>Data controls</h4>
                        </div>
                    <div className={`settings-menu-item ${selectedSettingsItem === "about" && "active"}`}  onClick={(e)=> {
                        e.target.style.opacity = "0.7"
                        setTimeout(() => {
                            e.target.style.opacity = "1"
                        }, 200);
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
                                <div className="buttonContainer" onClick={(e)=>{
                                    if(isLoggedIn && user){
                                        e.target.style.opacity = "0.7"
                                        setTimeout(() => {
                                            e.target.style.opacity = "1"
                                        }, 200);
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
                            <div className="customizeAI">
                                <h3>Customise Que AI</h3>

                                <p>Your nickname</p>
                                <input 
                                    ref={cusNameRef}
                                    type="text" 
                                    placeholder='What should Que AI call you?'
                                    defaultValue={
                                        (customPreferences && customPreferences.userName) ? customPreferences.userName : null
                                    }
                                    />
                                <p>Your preferences</p>
                                <textarea
                                    ref={cusPrefRef}
                                    type="text" 
                                    placeholder='Tell Que AI about you. ' 
                                    rows={"4"}
                                    defaultValue={
                                        (customPreferences && customPreferences.preferences) ? customPreferences.preferences : null
                                    }
                                />
                                <p>How Que AI want to be?</p>
                                <textarea 
                                    ref={cusDescRef}
                                    type="text" 
                                    placeholder='Describe how Ai wanted to be.' 
                                    rows={"4"}
                                    defaultValue={
                                        (customPreferences && customPreferences.describe) ? customPreferences.describe : null
                                    }
                                />

                                <div className="btn-container">
                                    <div className="save-btn" onClick={(e)=>{
                                        e.target.style.opacity = "0.7"
                                        setTimeout(() => {
                                            e.target.style.opacity = "1"
                                        }, 200);
                                        setCustomPreferences({
                                            userName: cusNameRef.current.value,
                                            preferences: cusPrefRef.current.value,
                                            describe: cusDescRef.current.value
                                        })
                                    }}>Save</div>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        selectedSettingsItem == "appearance" &&  
                        <div className='animations'>
                            <div className="settings-item">
                                <p className="item-name">Dark mode</p>
                                <div className={`switch ${darkmode && "active"}`} onClick={() => setDarkmode(!darkmode)} >
                                    <div className="switch-btn"></div>
                                </div>
                            </div>
                            {/* {
                                animations && 
                                <>
                                    <div className="settings-item">
                                        <p className="item-name">Custom animation colour</p>
                                        <div className={`switch ${customAnimEnabled && "active"}`} onClick={() => setCustomAnimEnabled(!customAnimEnabled)} >
                                            <div className="switch-btn"></div>
                                        </div>
                                    </div>
                                </>
                            } */}
                            
                        </div>
                    }

                    {
                        selectedSettingsItem == "datacontrols" &&
                        <div className='datacontrols'>

                             <div className="settings-item">
                                <p className="item-name">Delete chat data</p>
                                <div className="delete-btn" onClick={(e)=>{
                                    e.target.style.opacity = "0.7"
                                    setTimeout(() => {
                                        e.target.style.opacity = "1"
                                    }, 200);

                                    deletedata()
                                    
                                }}>
                                    Delete
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
                                    <p>An  open - source AI chatbot application designed & developed by <br /> <a href='https://github.com/SafwanKS' onClick={(e)=> {
                                    e.preventDefault()
                                    window.open("https://github.com/SafwanKS")
                                    }}>Safwan KS</a> and <a href='https://github.com/jude7733' onClick={(e)=> {
                                    e.preventDefault()
                                    window.open("https://github.com/jude7733")
                                    }}>Jude</a></p>
                                </div>
                            </div>

                            <div className="links">
                                <div className="github-repo">
                                    {/* <p>Github:  </p> */}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Settings