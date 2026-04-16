"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  ts: string;
}

const SUGGESTIONS = [
  "What should I learn next?",
  "How do I prepare for interviews?",
  "What skills are in demand for my career?",
  "Give me a 30-day study plan",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      text: "Hello! I'm your CarreonX Mentor 🤖\n\nI can help you with career advice, skill recommendations, interview preparation and learning plans. What would you like to talk about?",
      ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId]   = useState<number | null>(null);   // ✅ FIX: was missing
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const u = JSON.parse(userStr);
      setUserId(u.id);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text,
      ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const uid = userId ?? 1;
      const response = await fetch(
        `${API_BASE_URL}/chatbot/ask?user_id=${uid}&question=${encodeURIComponent(text)}`,
        { method: "POST" }
      );
      const data = await response.json();
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: data.answer || "I'm having trouble connecting right now. Please try again shortly.",
        ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: `⚠️ Cannot reach the backend. Make sure the server at ${API_BASE_URL} is running.`,
          ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {

      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div
      style={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        background: "var(--background)",
        padding: "1.5rem",
        gap: "1rem",
      }}
    >
      {/* ── Header ── */}
      <div
        className="glass-panel fade-in"
        style={{
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "14px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div
            style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.2rem", animation: "glow 3s infinite",
            }}
          >
            🤖
          </div>
          <div>
            <h1 style={{ fontSize: "1.1rem", fontWeight: 700, color: "white" }}>CarreonX Mentor</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--success)", display: "inline-block" }} />
              <span style={{ color: "var(--success)", fontSize: "0.75rem", fontWeight: 500 }}>Online</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/roadmap" className="btn-ghost" style={{ padding: "0.45rem 1rem", fontSize: "0.8rem" }}>
            View Roadmap
          </Link>
          <button
            onClick={() =>
              setMessages([{
                id: Date.now(), role: "ai",
                text: "Chat cleared! How can I help you?",
                ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              }])
            }
            className="btn-ghost"
            style={{ padding: "0.45rem 1rem", fontSize: "0.8rem" }}
          >
            🗑 Clear
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        className="glass-panel"
        style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: 0 }}
      >
        <div
          style={{
            flex: 1, overflowY: "auto",
            padding: "1.5rem",
            display: "flex", flexDirection: "column", gap: "1.25rem",
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className="fade-up"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: m.role === "user" ? "flex-end" : "flex-start",
                gap: "0.3rem",
              }}
            >
              {m.role === "ai" && (
                <span style={{ fontSize: "0.7rem", color: "var(--muted)", marginLeft: "0.5rem" }}>
                  🤖 CarreonX Mentor
                </span>
              )}
              <div className={m.role === "user" ? "bubble-user" : "bubble-ai"}>
                {m.text.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < m.text.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
              <span style={{ fontSize: "0.7rem", color: "var(--muted)", marginLeft: m.role === "ai" ? "0.5rem" : 0, marginRight: m.role === "user" ? "0.5rem" : 0 }}>
                {m.ts}
              </span>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.3rem" }}>
              <span style={{ fontSize: "0.7rem", color: "var(--muted)", marginLeft: "0.5rem" }}>
                🤖 CarreonX Mentor is typing...
              </span>
              <div className="bubble-ai">
                <div className="ai-loader" style={{ margin: 0 }}>
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Suggestion chips (only shown when just greeting visible) ── */}
        {messages.length === 1 && (
          <div
            style={{
              padding: "0.75rem 1.5rem",
              borderTop: "1px solid var(--glass-border)",
              display: "flex", gap: "0.5rem", flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--muted)", alignSelf: "center", marginRight: "0.25rem" }}>
              Try asking:
            </span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                style={{
                  background: "rgba(0,240,255,0.07)",
                  border: "1px solid rgba(0,240,255,0.2)",
                  color: "var(--primary)",
                  borderRadius: "100px",
                  padding: "0.3rem 0.85rem",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  transition: "var(--transition)",
                  fontFamily: "var(--font-body)",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "rgba(0,240,255,0.15)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "rgba(0,240,255,0.07)")}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* ── Input ── */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "1rem 1.25rem",
            borderTop: "1px solid var(--glass-border)",
            display: "flex", gap: "0.75rem", alignItems: "center",
            background: "rgba(255,255,255,0.02)",
            flexShrink: 0,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="input-field"
            placeholder="Ask your career mentor anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, margin: 0 }}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !input.trim()}
            style={{ padding: "0.8rem 1.5rem", flexShrink: 0 }}
          >
            {loading ? <span className="spinner" style={{ width: "18px", height: "18px" }} /> : "Send ➤"}
          </button>
        </form>
      </div>
    </div>
  );
}
