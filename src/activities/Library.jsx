import React from "react";
import '../css/Library.css'
import { forwardRef, useEffect, useState, useRef } from 'react'

const Library = forwardRef(({
    drawerCollapsed,
    handleClearChat
}, ref) => {



    return (
        <div className="library" ref={ref}>
            <div className="library-header" style={{
                padding: window.innerWidth > 768 && drawerCollapsed ? "0 0 0 100px" : "0 20px"
            }}>
                <div className="result-header-left">
                    {
                        window.innerWidth <= 768 &&

                        <div className="back-btn" onClick={() => {
                            handleClearChat()
                        }} >
                            <span className="material-symbols-outlined">arrow_back_ios_new</span>
                            <p>Back</p>
                        </div>
                    }
                </div>
                <div className="result-header-center">
                    {/* <p>Collections</p> */}
                </div>
                <div className="result-header-right">

                </div>

                {/* <h4>Library</h4> */}


            </div>
            <div className="library-body" style={{
                padding: window.innerWidth > 768 && drawerCollapsed ? "0px 100px 0 170px" : "0px 50px 0 50px"
            }}>

                <div className="library-title">
                    <h1>Collections</h1>
                    <div className="gap"></div>
                    <div className="searchBar">
                        <span className="material-symbols-outlined">search</span>
                        <p>Search Collections</p>
                        {/* <div className="keys">
                        <p>CTRL</p>
                        <p>K</p>
                    </div> */}
                    </div>

                </div>



                {/* <div className="folders-container">
                    <div className="folders-head">
                        <p>Folders</p>
                    </div>

                    <div className="folders-list">
                        
                    </div>

                </div> */}

                <div className="stories-container">
                    <div className="stories-head">
                        <p><span className="material-symbols-outlined">auto_stories</span> Stories</p>
                        <div className="next-btn" onClick={() => {
                            console.log("CLicked")
                        }}>
                            <span className="material-symbols-outlined">arrow_forward_ios</span>
                        </div>
                    </div>

                    <div className="stories-list">
                        <div className="library-list-item">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
                            <div className="library-item-footer">
                                <div className="left">
                                    <p>26/04/2026</p>
                                </div>
                                <div className="right">
                                    <div className="library-item-footer-btn">
                                        <span className="material-symbols-outlined">
                                            more_horiz
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="lessons-container">
                    <div className="lessons-head">
                        <p><span className="material-symbols-outlined">school</span>Lessons</p>
                        <div className="next-btn">
                            <span className="material-symbols-outlined">arrow_forward_ios</span>
                        </div>
                    </div>
                    <div className="lessons-list">

                    </div>
                </div>

                <div className="saved-container">
                    <div className="saved-head">
                        <p><span className="material-symbols-outlined">bookmark</span>Saved</p>
                        <div className="next-btn">
                            <span className="material-symbols-outlined">arrow_forward_ios</span>
                        </div>
                    </div>
                    <div className="saved-list">

                    </div>
                </div>


            </div>
        </div>
    )
})


export default Library