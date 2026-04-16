"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

function LoginContent() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router       = useRouter();
  const searchParams = useSearchParams();
  const message      = searchParams.get("message");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res  = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed. Please check your credentials.");

      localStorage.setItem("user",  JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("auth-change"));

      // Check for existing profile
      try {
        const profileRes = await fetch(`${API_BASE_URL}/profile/${data.user.id}`);
        router.push(profileRes.ok ? "/" : "/onboarding");
      } catch {
        router.push("/onboarding");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
      }}
    >
      {/* Ambient blobs */}
      <div style={{ position: "fixed", width: "450px", height: "450px", background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)", opacity: 0.07, top: "-80px", left: "-80px", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", width: "500px", height: "500px", background: "radial-gradient(circle, var(--secondary) 0%, transparent 70%)", opacity: 0.07, bottom: "-80px", right: "-80px", zIndex: 0, pointerEvents: "none" }} />

      <div className="glass-panel fade-up" style={{ maxWidth: "440px", width: "100%", padding: "3.5rem", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "16px",
            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            margin: "0 auto 1.25rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.75rem", boxShadow: "0 4px 24px rgba(0,240,255,0.3)",
          }}>
            🚀
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "white", marginBottom: "0.5rem", fontFamily: "var(--font-sans)" }}>
            Welcome Back
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
            Continue your journey to career mastery.
          </p>
        </div>

        {message && <div className="alert alert-info" style={{ marginBottom: "1.5rem" }}>ℹ️ {message}</div>}
        {error   && <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.25rem" }}>
          <div>
            <label htmlFor="login-email" className="form-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              required
              className="input-field"
              placeholder="alex@CarreonX.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="login-password" className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            id="login-submit"
            className="btn-primary"
            disabled={loading}
            style={{ padding: "1rem", fontSize: "1rem", marginTop: "0.5rem" }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                <span className="spinner" style={{ width: "18px", height: "18px" }} /> Authenticating...
              </span>
            ) : (
              "Sign In →"
            )}
          </button>
        </form>

        <div className="divider" style={{ margin: "2rem 0" }} />

        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            New to CarreonX?{" "}
            <Link
              href="/signup"
              style={{ color: "var(--secondary)", fontWeight: 600, textDecoration: "none", transition: "var(--transition)" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "var(--primary)")}
              onMouseOut={(e)  => (e.currentTarget.style.color = "var(--secondary)")}
            >
              Create free account →
            </Link>
          </p>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <span className="badge badge-primary">🗺️ Free Roadmap</span>
            <span className="badge badge-secondary">🤖 AI Mentor</span>
            <span className="badge badge-success">🧪 Mock Tests</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="ai-loader"><div className="dot" /><div className="dot" /><div className="dot" /></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
