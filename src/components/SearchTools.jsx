import React, { forwardRef } from 'react'

const SearchTools = forwardRef(({
    setQuestion,
    inputRef,
    setBtnState,
    setToolMode,
    setToolName,
    animState,
    searchContainerRef,
    showCanvasWindow,
    setShowProjectCreation,
    setCustomePlaceHolder,
    setShowSuggestions,
    setSuggestionsList
}, ref) => {

    const suggessions = {
        code: [
            "Create a minimalist portfolio website",
            "Build a calculator using HTML, CSS & JS",
            "Build a dark-themed notes app",
            "Create a stylish login page",
            "Build a to-do list app with local storage"
        ],
        story: [
            "Write a thrilling mystery story about a missing detective",
            "Create a heartwarming tale of friendship and courage",
            "Write a sci-fi adventure about space exploration",
            "Create a fantasy story about magic and dragons",
            "Write a historical fiction story set in ancient Rome"
        ],
        learn: [
            "Teach me Linux from beginner to advanced",
            "Help me learn spoken English",
            "Help me understand human anatomy",
            "Teach me Javascript basics",
            "Explain how blockchain works"
        ]

    }

    return (
        <div ref={ref} className="toolsContainer invisible">
            <div className="tool" onClick={(e) => {
                e.target.style.opacity = "0.7"
                setTimeout(() => {
                    e.target.style.opacity = "1"
                }, 200);
                setToolMode(true)
                setToolName("draw")
                // searchContainerRef.current.classList.add("onsearch")
                showCanvasWindow()
                setCustomePlaceHolder("Describe your image")
                ref.current.classList.add("hide")
                setTimeout(() => {
                    inputRef.current.focus()
                }, 100);
            }}>
                <span className='material-symbols-outlined'>animated_images</span>
                <p>Create an image</p>
            </div>
            <div className="tool" onClick={(e) => {
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
                setCustomePlaceHolder("Describe your idea...")
                setSuggestionsList(suggessions.code)
                setShowSuggestions(true)
                ref.current.classList.add("hide")
                // setShowProjectCreation(true)

            }}>
                <span className='material-symbols-outlined'>code</span>
                <p>Create a project</p>
            </div>
            <div className="tool" onClick={(e) => {
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
                setCustomePlaceHolder("Enter text to summarise")
                ref.current.classList.add("hide")
            }}>
                <span className='material-symbols-outlined'>assignment</span>
                <p>Summarise text</p>
            </div>
            <div className="tool" onClick={(e) => {
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
                setCustomePlaceHolder("Write a story about...")
                setSuggestionsList(suggessions.story)
                setShowSuggestions(true)
                ref.current.classList.add("hide")
            }} >
                <span className='material-symbols-outlined'>ink_pen</span>
                <p>Write a story</p>
            </div>
            <div className="tool" onClick={(e) => {
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
                setCustomePlaceHolder("What do you want to learn?")
                setSuggestionsList(suggessions.learn)
                setShowSuggestions(true)
                ref.current.classList.add("hide")

            }} >
                <span className='material-symbols-outlined'>school</span>
                <p>Learn a topic</p>
            </div>
        </div>
    )
})

export default SearchTools