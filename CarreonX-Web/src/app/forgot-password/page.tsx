"use client";
import { useState } from "react";
import { API_BASE_URL } from "@/lib/config";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Something went wrong.");
      setMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ backgroundColor: "#000000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", fontFamily: "var(--font-sans, sans-serif)", color: "#ffffff" }}>
      {/* Background Glow */}
      <div style={{ position: "absolute", top: "-15%", left: "-10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(0,0,0,0) 70%)", filter: "blur(60px)", zIndex: 0, pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", bottom: "-15%", right: "-10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)", filter: "blur(60px)", zIndex: 0, pointerEvents: "none" }}></div>

      {/* Main Glass Container */}
      <div className="animate-fade-up" style={{ 
        position: "relative",
        zIndex: 1,
        width: "100%", 
        maxWidth: "360px", 
        padding: "2rem 1.5rem",
        background: "rgba(10, 10, 10, 0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "24px",
        border: "1px solid rgba(59, 130, 246, 0.35)",
        boxShadow: "0 0 40px rgba(59, 130, 246, 0.12), inset 0 1px 0 rgba(255,255,255,0.08)"
      }}>
        
        {/* Title */}
        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#60A5FA" }}>Reset Password</h1>
        </div>

        {/* Status Messages */}
        {error && (
          <div style={{ background: "rgba(248, 113, 113, 0.1)", border: "1px solid rgba(248, 113, 113, 0.3)", color: "#f87171", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.9rem", textAlign: "center" }}>
            ✕ {error}
          </div>
        )}
        {message && (
          <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34d399", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.9rem", textAlign: "center" }}>
            ✓ {message}
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: 600 }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "0.75rem 1rem",
                  color: "#ffffff",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#3B82F6"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "0.5rem",
                padding: "0.8rem",
                fontSize: "1rem",
                fontWeight: 700,
                color: "#ffffff",
                background: "linear-gradient(135deg, #3B82F6, #6366F1)",
                border: "none",
                borderRadius: "12px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: "0 8px 24px rgba(59,130,246,0.35)",
                opacity: loading ? 0.8 : 1
              }}
              onMouseOver={(e) => { if(!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(59,130,246,0.5)"; }}}
              onMouseOut={(e) => { if(!loading) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(59,130,246,0.35)"; }}}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
