"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../lib/config";

type AuthResponse = {
  user: {
    id: number;
  };
  token: string;
  detail?: string;
};

export default function SignupPage() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data: AuthResponse = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed. Please try again.");
      
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userId", String(data.user.id));
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("auth-change"));

      router.push(`/onboarding?userId=${data.user.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ backgroundColor: "#000000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", fontFamily: "var(--font-sans, sans-serif)", color: "#ffffff", padding: "2rem 0" }}>
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
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#60A5FA" }}>Create Account</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ background: "rgba(248, 113, 113, 0.1)", border: "1px solid rgba(248, 113, 113, 0.3)", color: "#f87171", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.9rem", textAlign: "center" }}>
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {/* Username Input */}
          <div>
            <label htmlFor="username" style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: 600 }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              minLength={3}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Your username"
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
              onFocus={(e) => { e.currentTarget.style.borderColor = "#FACC15"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(250,204,21,0.1)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: 600 }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              onFocus={(e) => { e.currentTarget.style.borderColor = "#FACC15"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(250,204,21,0.1)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: 600 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min. 6 characters"
                style={{
                  width: "100%",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "0.75rem 2.5rem 0.75rem 1rem",
                  color: "#ffffff",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#3B82F6"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", display: "flex", padding: "4px" }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPassword ? (
                    <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>
                  ) : (
                    <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirm" style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: 600 }}>
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="confirm"
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                style={{
                  width: "100%",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "0.75rem 2.5rem 0.75rem 1rem",
                  color: "#ffffff",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#3B82F6"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", display: "flex", padding: "4px" }}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showConfirmPassword ? (
                    <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>
                  ) : (
                    <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></>
                  )}
                </svg>
              </button>
            </div>
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
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}
