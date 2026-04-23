"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type SessionUser = {
  id: number;
  username: string;
  email: string;
};

type CareerProfile = {
  domain?: string;
  skills?: string[] | string;
};

export default function ProfilePage() {
  const [user, setUser]         = useState<SessionUser | null>(null);
  const [profile, setProfile]   = useState<CareerProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const router = useRouter();

  // 1. Load user from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
    } else {
      setLoadingProfile(false);
    }
  }, []);

  // 2. Fetch career profile from backend
  useEffect(() => {
    const userId = user?.id;
    if (!userId) {
      setLoadingProfile(false);
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch(`${API_BASE_URL}/profile/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
    setTimeout(() => window.location.reload(), 80);
  };

  /* ── Not logged in ── */
  if (!user && !loadingProfile) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1.5rem",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3rem" }}>🔒</div>
        <h2 style={{ color: "white", fontSize: "1.75rem" }}>Sign in to view your profile</h2>
        <p style={{ color: "var(--muted)" }}>Create an account or log in to manage your career profile.</p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/login" className="btn-primary">Login</Link>
          <Link href="/signup" className="btn-ghost">Create Account</Link>
        </div>
      </div>
    );
  }

  /* ── Loading ── */
  if (loadingProfile) {
    return (
      <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="ai-loader"><div className="dot" /><div className="dot" /><div className="dot" /></div>
      </div>
    );
  }

  const skills: string[] = profile?.skills
    ? (Array.isArray(profile.skills) ? profile.skills : profile.skills.split(",").map((s: string) => s.trim()))
    : [];

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: "860px" }}>

        {/* Header */}
        <div
          className="fade-up"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1 className="gradient-text" style={{ fontSize: "2.75rem", fontWeight: 800 }}>
              Your Profile
            </h1>
            <p style={{ color: "var(--muted)", marginTop: "0.4rem" }}>
              Manage your professional identity and career goals.
            </p>
          </div>
          <button onClick={handleLogout} className="btn-danger">
            🚪 Logout
          </button>
        </div>

        {/* ── Account Card ── */}
        <div className="glass-panel fade-up delay-1" style={{ padding: "2.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "2rem" }}>
            <div
              style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem", fontWeight: 800, color: "#000", flexShrink: 0,
                boxShadow: "0 0 24px rgba(0,240,255,0.3)",
              }}
            >
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "white" }}>
                {user?.username}
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{user?.email}</p>
              {profile?.domain && (
                <span className="badge badge-primary" style={{ marginTop: "0.5rem" }}>
                  {profile.domain}
                </span>
              )}
            </div>
          </div>

          <div className="divider" />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem" }}>
            <div>
              <label className="form-label">Username</label>
              <div className="input-field" style={{ cursor: "default", color: "var(--muted)" }}>
                {user?.username}
              </div>
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <div className="input-field" style={{ cursor: "default", color: "var(--muted)" }}>
                {user?.email}
              </div>
            </div>
            <div>
              <label className="form-label">Member Since</label>
              <div className="input-field" style={{ cursor: "default", color: "var(--muted)" }}>
                {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Career Profile Card ── */}
        <div className="glass-panel fade-up delay-2" style={{ padding: "2.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <h3 style={{ color: "var(--secondary)", fontSize: "1.2rem", fontWeight: 700 }}>
              🎯 Career Profile
            </h3>
            <Link href="/onboarding" className="btn-ghost" style={{ padding: "0.45rem 1.1rem", fontSize: "0.825rem" }}>
              ✏️ Edit Profile
            </Link>
          </div>

          {profile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label className="form-label">Career Domain</label>
                <div
                  style={{
                    padding: "0.85rem 1.1rem",
                    background: "rgba(189,0,255,0.08)",
                    border: "1px solid rgba(189,0,255,0.25)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--secondary)",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                  }}
                >
                  {profile.domain || "Not set"}
                </div>
              </div>

              <div>
                <label className="form-label">Skills</label>
                {skills.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.25rem" }}>
                    {skills.map((s: string) => (
                      <span key={s} className="skill-tag">{s}</span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No skills listed yet.</p>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
                You haven&apos;t set up your career profile yet. Set it up so CarreonX can personalise your roadmap and recommendations.
              </p>
              <Link href="/onboarding" className="btn-primary">
                🚀 Set Up Career Profile
              </Link>
            </div>
          )}
        </div>

        {/* ── Quick Links ── */}
        <div
          className="fade-up delay-3"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}
        >
          {[
            { href: "/roadmap",  icon: "🗺️", label: "View Roadmap" },
            { href: "/chat",     icon: "🤖", label: "AI Mentor Chat" },
            { href: "/progress", icon: "📊", label: "Learning Progress" },
            { href: "/mocktest", icon: "🧪", label: "Take Mock Test" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ textDecoration: "none" }}
              className="glass-card"
            >
              <div style={{ padding: "1.25rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{link.icon}</div>
                <div style={{ color: "var(--foreground)", fontSize: "0.9rem", fontWeight: 600 }}>{link.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
