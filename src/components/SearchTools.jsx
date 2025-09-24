import React, { forwardRef } from 'react'

const SearchTools = forwardRef(({
    setQuestion,
    inputRef,
    setBtnState,
    setToolMode,
    setToolName,
    setAnimactive, 
    animState,
    searchContainerRef,
    showCanvasWindow,
    setCustomePlaceHolder
}, ref)=>{
    return (
        <div ref={ref} className="toolsContainer">
            <div className="tool" onClick={(e)=> {
                e.target.style.opacity = "0.7"
                setTimeout(() => {
                e.target.style.opacity = "1"
                }, 200);
                setToolMode(true)
                setToolName("draw")
                // searchContainerRef.current.classList.add("onsearch")
                showCanvasWindow()
                setCustomePlaceHolder("Describe your image")
                setTimeout(() => {
                    inputRef.current.focus()
                }, 100);
                animState && setAnimactive(true)
                
            }}>
                <span className='material-symbols-outlined'>draw</span>
                <p>Create an image</p>
            </div>
            <div className="tool" onClick={(e)=> {
                // setQuestion("How do I optimize this Python loop for better performance?")
                // inputRef.current.value = "How do I optimize this Python loop for better performance?"
                e.target.style.opacity = "0.7"
                setTimeout(() => {
                e.target.style.opacity = "1"
                }, 200);
                setTimeout(() => {
                    inputRef.current.focus()
                }, 100);
                
                // inputRef.current.classList.remove("active")
                // setBtnState(true)
                setToolMode(true)
                setToolName("code")
                animState && setAnimactive(true)
                }}>
                <span className='material-symbols-outlined'>code</span>
                <p>Create a project</p>
            </div>
            <div className="tool" onClick={(e)=>{
                e.target.style.opacity = "0.7"
                setTimeout(() => {
                e.target.style.opacity = "1"
                }, 200);
                // setQuestion("Can you summarise this text for me? ")
                // inputRef.current.value = "Can you summarise this text for me? "
                setTimeout(() => {
                    inputRef.current.focus()
                }, 100);
                // inputRef.current.classList.remove("active")
                // setBtnState(true)
                setToolMode(true)
                setToolName("summarise")
                animState && setAnimactive(true)
            }}>
                <span className='material-symbols-outlined'>assignment</span>
                <p>Summarise text</p>
            </div>
            <div className="tool" onClick={(e)=>{
                e.target.style.opacity = "0.7"
                setTimeout(() => {
                e.target.style.opacity = "1"
                }, 200);
                // setQuestion("Can you help me write a short story about a brave knight?")
                // inputRef.current.value = "Can you help me write a short story about a brave knight?"
                setTimeout(() => {
                    inputRef.current.focus()
                }, 100);
                // inputRef.current.classList.remove("active")
                // setBtnState(true)
                setToolMode(true)
                setToolName("story")
                animState && setAnimactive(true)
            }} >
                <span className='material-symbols-outlined'>ink_pen</span>
                <p>Write a story</p>
            </div>
            <div className="tool" onClick={(e)=>{
                e.target.style.opacity = "0.7"
                setTimeout(() => {
                e.target.style.opacity = "1"
                }, 200);
                // setQuestion("What are the key concepts in quantum physics?")
                // inputRef.current.value = "What are the key concepts in quantum physics?"
                setTimeout(() => {
                    inputRef.current.focus()
                }, 100);
                // inputRef.current.classList.remove("active")
                // setBtnState(true)
                setToolMode(true)
                setToolName("learn")
                animState && setAnimactive(true)
            }} >
                <span className='material-symbols-outlined'>book_2</span>
                <p>Learn a topic</p>
            </div>
        </div>
    )
})

export default SearchTools