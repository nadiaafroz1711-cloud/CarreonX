"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

export default function SignupPage() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
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
      const res  = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email:    formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed. Please try again.");
      localStorage.setItem("user",  JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("auth-change"));


      router.push(`/onboarding?userId=${data.user.id}`);

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
      <div style={{ position: "fixed", width: "450px", height: "450px", background: "radial-gradient(circle, var(--secondary) 0%, transparent 70%)", opacity: 0.07, top: "-80px", right: "-80px", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", width: "500px", height: "500px", background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)", opacity: 0.07, bottom: "-80px", left: "-80px", zIndex: 0, pointerEvents: "none" }} />

      <div className="glass-panel fade-up" style={{ maxWidth: "480px", width: "100%", padding: "3.5rem", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "16px",
            background: "linear-gradient(135deg, var(--secondary), var(--primary))",
            margin: "0 auto 1.25rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.75rem", boxShadow: "0 4px 24px rgba(189,0,255,0.3)",
          }}>
            ✦
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "white", marginBottom: "0.5rem", fontFamily: "var(--font-sans)" }}>
            Join CarreonX
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
            Transform your future with AI-guided career precision.
          </p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.25rem" }}>
          <div>
            <label htmlFor="signup-username" className="form-label">Username</label>
            <input
              id="signup-username"
              type="text"
              required
              className="input-field"
              placeholder="alex_dev"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              minLength={3}
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="form-label">Email Address</label>
            <input
              id="signup-email"
              type="email"
              required
              className="input-field"
              placeholder="alex@CarreonX.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="form-label">Password</label>
            <input
              id="signup-password"
              type="password"
              required
              className="input-field"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="signup-confirm" className="form-label">Confirm Password</label>
            <input
              id="signup-confirm"
              type="password"
              required
              className="input-field"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
            />
          </div>

          {/* Password strength bar */}
          {formData.password && (
            <div>
              <div className="progress-track" style={{ height: "5px" }}>
                <div
                  className="progress-fill"
                  style={{
                    width:
                      formData.password.length >= 12 ? "100%" :
                      formData.password.length >= 8  ? "66%"  :
                      formData.password.length >= 6  ? "33%"  : "10%",
                    background:
                      formData.password.length >= 12 ? "var(--success)" :
                      formData.password.length >= 8  ? "var(--primary)" :
                      formData.password.length >= 6  ? "var(--warning)" : "var(--danger)",
                    boxShadow: "none",
                  }}
                />
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "0.35rem" }}>
                Strength:{" "}
                <span style={{
                  color:
                    formData.password.length >= 12 ? "var(--success)" :
                    formData.password.length >= 8  ? "var(--primary)" :
                    formData.password.length >= 6  ? "var(--warning)" : "var(--danger)",
                  fontWeight: 600,
                }}>
                  {formData.password.length >= 12 ? "Strong" :
                   formData.password.length >= 8  ? "Good"   :
                   formData.password.length >= 6  ? "Fair"   : "Weak"}
                </span>
              </p>
            </div>
          )}

          <button
            id="signup-submit"
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ padding: "1rem", fontSize: "1rem", marginTop: "0.25rem" }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                <span className="spinner" style={{ width: "18px", height: "18px" }} /> Creating account...
              </span>
            ) : (
              "Create My Account ✦"
            )}
          </button>
        </form>

        <div className="divider" style={{ margin: "2rem 0" }} />

        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link
            href="/login"
            style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}
            onMouseOver={(e) => (e.currentTarget.style.color = "var(--secondary)")}
            onMouseOut={(e)  => (e.currentTarget.style.color = "var(--primary)")}
          >
            Sign In →
          </Link>
        </p>
      </div>
    </div>
  );
}
