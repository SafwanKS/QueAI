import React, { forwardRef } from 'react'
import { Sparkles, Code2, FileText, PenLine, GraduationCap } from 'lucide-react'
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
    setSuggestionsList,
    setExpanded
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

    const iconProps = { size: 18 }

    return (
        <div ref={ref} className="toolsContainer invisible">
            <div className="tool" onClick={(e) => {
                e.target.style.opacity = "0.7"
                setTimeout(() => { e.target.style.opacity = "1" }, 200);
                setToolMode(true)
                setToolName("draw")
                setCustomePlaceHolder("Describe your image")
                setExpanded(true)
                ref.current.classList.add("hide")
                setTimeout(() => { inputRef.current.focus() }, 100);
            }}>
                <Sparkles {...iconProps} />
                <p>Create an image</p>
            </div>

            <div className="tool" onClick={(e) => {
                e.target.style.opacity = "0.7"
                setTimeout(() => { e.target.style.opacity = "1" }, 200);
                setTimeout(() => { inputRef.current.focus() }, 100);
                setToolMode(true)
                setToolName("code")
                setCustomePlaceHolder("Describe your idea...")
                setSuggestionsList(suggessions.code)
                setShowSuggestions(true)
                setExpanded(true)
                ref.current.classList.add("hide")
            }}>
                <Code2 {...iconProps} />
                <p>Create a project</p>
            </div>

            <div className="tool" onClick={(e) => {
                e.target.style.opacity = "0.7"
                setTimeout(() => { e.target.style.opacity = "1" }, 200);
                setTimeout(() => { inputRef.current.focus() }, 100);
                setToolMode(true)
                setToolName("summarise")
                setExpanded(true)
                setCustomePlaceHolder("Enter text to summarise")
                ref.current.classList.add("hide")
            }}>
                <FileText {...iconProps} />
                <p>Summarise text</p>
            </div>

            <div className="tool" onClick={(e) => {
                e.target.style.opacity = "0.7"
                setTimeout(() => { e.target.style.opacity = "1" }, 200);
                setTimeout(() => { inputRef.current.focus() }, 100);
                setToolMode(true)
                setToolName("story")
                setCustomePlaceHolder("Write a story about...")
                setSuggestionsList(suggessions.story)
                setShowSuggestions(true)
                setExpanded(true)
                ref.current.classList.add("hide")
            }}>
                <PenLine {...iconProps} />
                <p>Write a story</p>
            </div>

            <div className="tool" onClick={(e) => {
                e.target.style.opacity = "0.7"
                setTimeout(() => { e.target.style.opacity = "1" }, 200);
                setTimeout(() => { inputRef.current.focus() }, 100);
                setToolMode(true)
                setToolName("learn")
                setCustomePlaceHolder("What do you want to learn?")
                setSuggestionsList(suggessions.learn)
                setShowSuggestions(true)
                setExpanded(true)
                ref.current.classList.add("hide")
            }}>
                <GraduationCap {...iconProps} />
                <p>Learn a topic</p>
            </div>
        </div>
    )
})

export default SearchTools