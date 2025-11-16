import React, { useState, useRef, useEffect } from "react";
import "./ChatStream.css";

export default function ChatStream({ backendUrl = "http://localhost:8000/chat/stream" }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);

  const controllerRef = useRef(null);
  const listRef = useRef(null);
  const currentAIIdRef = useRef(null);
  const bufferRef = useRef("");

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
    };
  }, []);

  function scrollToBottom() {
    setTimeout(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, 30);
  }

  function appendNewMessage(msg) {
    setMessages((prev) => {
      const next = [...prev, msg];
      return next;
    });
    scrollToBottom();
  }

  function patchCurrentAIText(appendText) {
    // if current AI message doesn't exist, start a new one
    if (!currentAIIdRef.current) {
      const id = crypto.randomUUID();
      currentAIIdRef.current = id;
      setMessages((prev) => [...prev, { id, role: "ai", text: appendText }]);
      scrollToBottom();
      return;
    }

    setMessages((prev) =>
      prev.map((m) =>
        m.id === currentAIIdRef.current ? { ...m, text: (m.text || "") + appendText } : m
      )
    );
    scrollToBottom();
  }

  // Add a simple system "searching" line (no bubble background)
  function appendSearchingLine(query) {
    appendNewMessage({
      id: crypto.randomUUID(),
      role: "system",
      subtype: "searching",
      text: "Searching web",
      query: query || "",
    });
    // ensure current AI is finished so tool/system lines are separate
    currentAIIdRef.current = null;
  }

  // Add sources message (collapsible green bubble)
  function appendSourcesMessage(sourcesArray) {
    appendNewMessage({
      id: crypto.randomUUID(),
      role: "sources",
      sources: sourcesArray,
    });
    currentAIIdRef.current = null; // separate from AI bubble
  }

  async function sendMessage() {
    if (!input.trim() || streaming) return;

    appendNewMessage({ id: crypto.randomUUID(), role: "user", text: input });
    const body = { user_input: input };
    setInput("");
    controllerRef.current = new AbortController();
    bufferRef.current = "";
    currentAIIdRef.current = null;
    setStreaming(true);

    try {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controllerRef.current.signal,
      });

      if (!res.ok || !res.body) {
        appendNewMessage({ id: crypto.randomUUID(), role: "system", text: `HTTP error: ${res.status}` });
        setStreaming(false);
        currentAIIdRef.current = null;
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        bufferRef.current += decoder.decode(value, { stream: true });
        const lines = bufferRef.current.split(/\r?\n/);
        bufferRef.current = lines.pop();

        for (const line of lines) {
          if (!line.trim()) continue;

          let obj;
          try {
            obj = JSON.parse(line);
          } catch {
            // ignore malformed partial JSON lines
            continue;
          }

          // if server indicates finalization
          if (obj.done) {
            setStreaming(false);
            currentAIIdRef.current = null;
            continue;
          }

          // TOOL messages (special handling)
          if (obj.type === "tool") {
            // transfer to research agent -> show Searching web (plain system line)
            if (obj.tool_used === "transfer_to_research_agent" || (obj.message && obj.message.toLowerCase().includes("transfer"))) {
              appendSearchingLine(obj.message || "");
              continue;
            }

            // If tool returned a JSON array as string (sources), parse and render as sources
            const msgText = obj.message || "";
            const trimmed = msgText.trim();
            if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
              try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) {
                  appendSourcesMessage(parsed);
                  continue;
                }
              } catch {
                // fallthrough to treat as plain text
              }
            }

            // Other tool messages - make them their own system bubble (don't append into AI)
            appendNewMessage({
              id: crypto.randomUUID(),
              role: "tool",
              text: msgText,
              tool_used: obj.tool_used || null,
            });
            currentAIIdRef.current = null;
            continue;
          }

          // default: AI message chunks -> append to current AI bubble
          const text = obj.message || "";
          patchCurrentAIText(text);
        }
      }

      // process leftover buffer (if complete JSON)
      if (bufferRef.current && bufferRef.current.trim()) {
        try {
          const obj = JSON.parse(bufferRef.current);
          if (!obj.done) {
            if (obj.type === "tool") {
              const msgText = obj.message || "";
              const trimmed = msgText.trim();
              if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                try {
                  const parsed = JSON.parse(trimmed);
                  if (Array.isArray(parsed)) {
                    appendSourcesMessage(parsed);
                  } else {
                    appendNewMessage({ id: crypto.randomUUID(), role: "tool", text: msgText });
                  }
                } catch {
                  appendNewMessage({ id: crypto.randomUUID(), role: "tool", text: msgText });
                }
              } else if (obj.tool_used === "transfer_to_research_agent") {
                appendSearchingLine(obj.message || "");
              } else {
                appendNewMessage({ id: crypto.randomUUID(), role: "tool", text: msgText });
              }
            } else {
              patchCurrentAIText(obj.message || "");
            }
          }
        } catch {
          // leftover partial JSON — ignore
        }
      }

      setStreaming(false);
      currentAIIdRef.current = null;
      bufferRef.current = "";
    } catch (err) {
      appendNewMessage({ id: crypto.randomUUID(), role: "system", text: `Error: ${err.message}` });
      setStreaming(false);
      currentAIIdRef.current = null;
      bufferRef.current = "";
    }
  }

  function stopStream() {
    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = null;
    setStreaming(false);
    currentAIIdRef.current = null;
    bufferRef.current = "";
  }

  // Message renderer
  function Message({ m }) {
    if (m.role === "sources" && Array.isArray(m.sources)) {
      return <SourcesBubble sources={m.sources} />;
    }

    if (m.role === "system" && m.subtype === "searching") {
      // Render searching line without bubble background
      return (
        <div className="chat-row left">
          <div className="searching-line">
            <strong>Searching web</strong>
            <span className="dot-ellipses" aria-hidden="true">...</span>
            {m.query ? <span className="search-query"> — {m.query}</span> : null}
          </div>
        </div>
      );
    }

    const bubbleClass = m.role === "user" ? "user" : m.role === "ai" ? "ai" : m.role === "system" ? "system" : m.role === "tool" ? "tool" : "ai";

    return (
      <div className={`chat-row ${m.role === "user" ? "right" : "left"}`}>
        <div className={`chat-bubble ${bubbleClass}`}>
          {m.text}
        </div>
      </div>
    );
  }

  // Collapsible sources bubble component
  function SourcesBubble({ sources }) {
    const [open, setOpen] = useState(false);

    const normalized = sources.map((s, idx) => {
      if (typeof s === "string") {
        return { title: s, url: s, snippet: "", id: idx };
      }
      return {
        title: s.title || s.name || s.text || s.url || `Source ${idx + 1}`,
        url: s.url || s.link || s.href || "",
        snippet: s.content || s.content_snippet || s.snippet || s.raw_content || "",
        id: idx,
      };
    });

    return (
      <div className="chat-row left">
        <div className="chat-bubble sources">
          <button
            className="sources-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            <div className="sources-header">
              <strong>Sources</strong>
              <span className="sources-count">{normalized.length}</span>
              <span className="sources-toggle-arrow">{open ? "▲" : "▼"}</span>
            </div>
            <div className="sources-sub">Click to {open ? "collapse" : "expand"} titles and URLs</div>
          </button>

          {open && (
            <ul className="sources-list">
              {normalized.map((s) => (
                <li key={s.id} className="source-item">
                  <a href={s.url || "#"} target="_blank" rel="noreferrer" className="source-title">
                    {s.title}
                  </a>
                  {s.url ? <div className="source-url">{s.url}</div> : null}
                  {s.snippet ? <div className="source-snippet">{s.snippet}</div> : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>QueAI Chat</h2>
        <span aria-live="polite">{streaming ? "Streaming..." : "Idle"}</span>
      </div>

      <div ref={listRef} className="chat-list" role="log" aria-live="polite">
        {messages.length === 0 && <div className="chat-empty">Say something 👋</div>}

        {messages.map((m) => (
          <Message key={m.id} m={m} />
        ))}
      </div>

      <div className="chat-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
          rows={3}
          aria-label="Type your message"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <div className="chat-buttons">
          <button
            className="send-btn"
            disabled={streaming || !input.trim()}
            onClick={sendMessage}
            aria-disabled={streaming || !input.trim()}
          >
            Send
          </button>

          {streaming && (
            <button className="stop-btn" onClick={stopStream}>
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
