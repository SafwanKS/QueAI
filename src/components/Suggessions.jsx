import { useState, useRef, forwardRef } from "react";
import "../css/Suggestions.css"

const Suggestions = forwardRef(({ suggestions, toolName }) => {

    return (
        <div className="suggestionList">
            {suggestions.map((suggestion, index) => (
                <div className="suggestionItem" key={index}>
                    <span className="material-symbols-outlined">{toolName === "code" ? "code" : toolName === "story" ? "ink_pen" : "school"}</span>
                    <p>{suggestion}</p>
                </div>
            ))}
        </div>
    )
})

export default Suggestions