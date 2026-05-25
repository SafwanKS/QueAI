import React, { useState, useEffect, useRef } from "react";

export default function GlobalTooltip() {
  const [text, setText] = useState("");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const timeout = useRef(null);

  useEffect(() => {
    const handleMouseOver = (e) => {
      const el = e.target.closest("[data-title]");
      if (el) {
        clearTimeout(timeout.current);
        const rect = el.getBoundingClientRect();
        setText(el.getAttribute("data-title"));
        setPos({
          x: rect.left + rect.width / 2,
          y: rect.bottom + 8,
        });
        setVisible(true);
      } else {
        timeout.current = setTimeout(() => setVisible(false), 100);
      }
    };

    const handleMouseOut = () => {
      timeout.current = setTimeout(() => setVisible(false), 100);
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      clearTimeout(timeout.current);
    };
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: pos.y,
      left: pos.x,
      transform: "translateX(-50%)",
      background: "#1a1a1a",
      color: "#e0e0e0",
      padding: "5px 10px",
      borderRadius: "50px",
      fontSize: "12px",
      pointerEvents: "none",
      zIndex: 9999,
      whiteSpace: "nowrap",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.15s ease",
      border: "1px solid #333",
    }}>
      {text}
    </div>
  );
}