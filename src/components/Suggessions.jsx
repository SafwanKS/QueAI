import { useState, useRef, forwardRef } from "react";
import "../css/Suggestions.css"
import { Code2, FileText, PenLine, GraduationCap } from 'lucide-react'

const Suggestions = forwardRef(({ suggestions, toolName, generateStory }, ref) => {

    return (
        <div className="suggestionList">
            {suggestions.map((suggestion, index) => (
                <div className="suggestionItem" key={index} onClick={(e) => {
                    e.target.style.opacity = "0.7"
                    setTimeout(() => {
                        e.target.style.opacity = "1"
                    }, 200);
                    if (toolName === "story") {
                        generateStory(suggestion)
                    }
                }}>
                    {toolName === "code" ? <Code2 size={17} /> :
                        toolName === "summarise" ? <FileText size={17} /> :
                            toolName === "story" ? <PenLine size={17} /> :
                                toolName === "learn" && <GraduationCap size={17} />}
                    <p>{suggestion}</p>
                </div>
            ))}
        </div>
    )
})

export default Suggestions