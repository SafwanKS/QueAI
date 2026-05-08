import {
    useState,
    useEffect,
    useRef,
    forwardRef
} from "react"

import '../css/BottomNav.css'

const BottomNav = forwardRef(({

}, ref) => {

    return (
        <div className="BottomNavContainer">
            <div className="BottomNav">
                <div className="BottomNavItem active">
                    <span className="material-symbols-outlined">home</span>
                    <p>Home</p>
                </div>
                <div className="BottomNavItem">
                    <span className="material-symbols-outlined">animated_images</span>
                    <p>Gallery</p>
                </div>
                <div className="BottomNavItem">
                    <span className="material-symbols-outlined">bookmark</span>
                    <p>Saved</p>
                </div>
                <div className="BottomNavItem">
                    <span className="material-symbols-outlined">account_circle</span>
                    <p>Login</p>
                </div>
            </div>
        </div>
    )
})


export default BottomNav