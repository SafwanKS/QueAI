import { useState, useRef, forwardRef } from "react";
import "../css/Suggestions.css"

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
                    <span className="material-symbols-outlined">{toolName === "code" ? "code" : toolName === "story" ? "ink_pen" : "school"}</span>
                    <p>{suggestion}</p>
                </div>
            ))}
        </div>
    )
})

export default Suggestions