import React, { useState, useEffect } from "react";

export default function GlobalTooltip() {
  const [text, setText] = useState("");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseOver = (e) => {
      const title = e.target.getAttribute("data-title");
      if (title) {
        setText(title);

        // Get element's position and size
        const rect = e.target.getBoundingClientRect();
        setPos({
          x: rect.left + rect.width / 2, // center horizontally
          y: rect.bottom + window.scrollY + 6, // just below the element
        });

        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    const handleMouseOut = () => {
      setVisible(false);
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return visible ? (
    <div
      style={{
        position: "absolute",
        top: pos.y,
        left: pos.x,
        transform: "translateX(-50%)",
        background: "#333",
        color: "#fff",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        pointerEvents: "none",
        zIndex: 9999,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  ) : null;
}
