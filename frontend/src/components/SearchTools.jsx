import React, { forwardRef } from 'react'

const SearchTools = forwardRef(({
    setQuestion,
    inputRef,
    setBtnState
}, ref)=>{
    return (
        <div ref={ref} className="toolsContainer">
            <div className="tool">
                <span className='material-symbols-outlined'>draw</span>
                <p>Create an image</p>
            </div>
            <div className="tool" onClick={()=> {
                setQuestion("How do I optimize this Python loop for better performance?")
                inputRef.current.value = "How do I optimize this Python loop for better performance?"
                inputRef.current.focus()
                inputRef.current.classList.remove("active")
                setBtnState(true)
                }}>
                <span className='material-symbols-outlined'>code</span>
                <p>Write a code</p>
            </div>
            <div className="tool" onClick={()=>{
                setQuestion("Can you summarise this text for me? ")
                inputRef.current.value = "Can you summarise this text for me? "
                inputRef.current.focus()
                inputRef.current.classList.remove("active")
                setBtnState(true)
            }}>
                <span className='material-symbols-outlined'>assignment</span>
                <p>Summarise text</p>
            </div>
            <div className="tool" onClick={()=>{
                setQuestion("Can you help me write a short story about a brave knight?")
                inputRef.current.value = "Can you help me write a short story about a brave knight?"
                inputRef.current.focus()
                inputRef.current.classList.remove("active")
                setBtnState(true)
            }} >
                <span className='material-symbols-outlined'>ink_pen</span>
                <p>Write a story</p>
            </div>
            <div className="tool" onClick={()=>{
                setQuestion("What are the key concepts in quantum physics?")
                inputRef.current.value = "What are the key concepts in quantum physics?"
                inputRef.current.focus()
                inputRef.current.classList.remove("active")
                setBtnState(true)
            }} >
                <span className='material-symbols-outlined'>book_2</span>
                <p>Learn a topic</p>
            </div>
        </div>
    )
})

export default SearchTools