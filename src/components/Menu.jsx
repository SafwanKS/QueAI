import { useState, useEffect, forwardRef } from "react";

const Menu = forwardRef(({
    menuPosition,
    children,
    darkmode
}, ref) => {
    return (
        <div ref={ref} className={`more-menu ${darkmode ? "dark" : ""}`} style={{
            display: "flex",
            position: "fixed",
            top: menuPosition && menuPosition.top,
            left: menuPosition && menuPosition.left,
            zIndex: 99999,
        }}>
            {children}
        </div>
    )
})

const MenuOption = forwardRef(({
    onClick,
    icon,
    text
}, ref) => {
    return (
        <div ref={ref} className={`more-menu-item ${text === "Delete" && "delete"}`} onClick={onClick}>
            <span className="material-symbols-outlined">{icon}</span>
            <p>{text}</p>
        </div>
    )
})

export { Menu, MenuOption }