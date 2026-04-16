"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const FEATURES = [
  {
    icon: "🗺️",
    title: "AI Career Roadmap",
    desc: "Get a step-by-step, personalised roadmap built by AI for your exact career goal.",
    href: "/roadmap",
    color: "var(--primary)",
  },
  {
    icon: "🤖",
    title: "AI Mentor Chat",
    desc: "Ask anything — your AI mentor is available 24/7 for career, skills, and interview advice.",
    href: "/chat",
    color: "var(--secondary)",
  },
  {
    icon: "📊",
    title: "Learning Analytics",
    desc: "Track your skills mastered, test scores, and overall progress in one place.",
    href: "/progress",
    color: "var(--success)",
  },
  {
    icon: "🧪",
    title: "Mock Tests",
    desc: "Validate your knowledge with AI-generated quizzes tailored to your career path.",
    href: "/mocktest",
    color: "var(--warning)",
  },
];

export default function HomePage() {
  const [user, setUser]     = useState<any>(null);
  const [career, setCareer] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleRecommend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!career || !skills) return;
    setLoading(true);
    router.push(
      `/roadmap?career=${encodeURIComponent(career)}&skills=${encodeURIComponent(skills)}`
    );
  };

  /* ── LOGGED-IN DASHBOARD ─────────────────────────────────────────────── */
  if (user) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: "1100px" }}>

          {/* Hero greeting */}
          <header className="fade-up" style={{ marginBottom: "3rem", textAlign: "center" }}>
            <div className="badge badge-primary" style={{ marginBottom: "1.25rem" }}>
              ✦ AI-Powered Career Intelligence
            </div>
            <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, marginBottom: "1rem" }}>
              Welcome back,{" "}
              <span className="gradient-text">{user.username}</span> 👋
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "1.15rem", maxWidth: "600px", margin: "0 auto" }}>
              Your AI career mentor is ready. Continue your personalised learning journey or ask anything.
            </p>
          </header>

          {/* Quick action buttons */}
          <div
            className="fade-up delay-1"
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "3.5rem",
            }}
          >
            <Link href="/roadmap" className="btn-primary" style={{ padding: "0.9rem 2rem" }}>
              🗺️ View My Roadmap
            </Link>
            <Link href="/chat" className="btn-ghost" style={{ padding: "0.9rem 2rem" }}>
              🤖 Talk to AI Mentor
            </Link>
            <Link href="/mocktest" className="btn-ghost" style={{ padding: "0.9rem 2rem" }}>
              🧪 Take Mock Test
            </Link>
          </div>

          {/* Feature cards */}
          <div
            className="fade-up delay-2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {FEATURES.map((f, i) => (
              <Link
                key={f.title}
                href={f.href}
                style={{ textDecoration: "none" }}
                className={`glass-card delay-${i + 1}`}
              >
                <div style={{ padding: "1.75rem" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      marginBottom: "1rem",
                      width: "52px",
                      height: "52px",
                      borderRadius: "12px",
                      background: `${f.color}18`,
                      border: `1px solid ${f.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {f.icon}
                  </div>
                  <h3 style={{ color: f.color, marginBottom: "0.6rem", fontSize: "1.05rem" }}>
                    {f.title}
                  </h3>
                  <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                    {f.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── GUEST LANDING PAGE ──────────────────────────────────────────────── */
  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1.5rem",
        textAlign: "center",
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "fixed", width: "500px", height: "500px",
          background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          opacity: 0.07, top: "-100px", left: "-100px", zIndex: 0, pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed", width: "500px", height: "500px",
          background: "radial-gradient(circle, var(--secondary) 0%, transparent 70%)",
          opacity: 0.07, bottom: "-100px", right: "-100px", zIndex: 0, pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", width: "100%" }}>
        <div className="badge badge-secondary fade-up" style={{ marginBottom: "1.5rem" }}>
          🚀 AI-Powered Career Intelligence Platform
        </div>

        <h1
          className="fade-up delay-1"
          style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 900, lineHeight: 1.05, marginBottom: "1.5rem" }}
        >
          Propel Your Career{" "}
          <span className="gradient-text">Into the Future</span>
        </h1>

        <p
          className="fade-up delay-2"
          style={{ fontSize: "1.2rem", color: "var(--muted)", maxWidth: "600px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}
        >
          CarreonX maps your unique path to professional mastery with AI-generated roadmaps,
          personalised recommendations and a 24/7 AI mentor.
        </p>

        {/* Quick-start form */}
        <div className="glass-panel fade-up delay-3" style={{ padding: "2.5rem", maxWidth: "620px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "1.5rem", color: "white" }}>
            Try it — Build Your AI Roadmap Instantly
          </h2>
          <form onSubmit={handleRecommend} style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="form-label" style={{ textAlign: "left" }}>Target Career</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. AI Engineer, Data Scientist, Full Stack Dev"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label" style={{ textAlign: "left" }}>Current Skills</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Python, React, SQL"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: "0.9rem" }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                  <span className="spinner" style={{ width: "18px", height: "18px" }} />
                  Building Roadmap...
                </span>
              ) : (
                "✦ Build My AI Roadmap"
              )}
            </button>
          </form>
          <div className="divider" />
          <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
              Sign in for a personalised experience →
            </Link>
          </p>
        </div>

        {/* Feature teaser strip */}
        <div
          className="fade-up delay-4"
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "2.5rem",
          }}
        >
          {["🗺️ Personalised Roadmaps", "🤖 AI Mentor Chat", "🧪 Mock Tests", "📊 Progress Tracking"].map((f) => (
            <span key={f} className="badge badge-primary">{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
