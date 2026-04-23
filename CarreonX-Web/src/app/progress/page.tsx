"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

type SessionUser = {
  id: number;
  username: string;
};

type DashboardStats = {
  progress_stats?: {
    completed_count: number;
    total_count: number;
    progress_percentage: number;
  };
  latest_test_score?: number;
  status?: string;
};

export default function ProgressPage() {
  const [stats, setStats]     = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser]       = useState<SessionUser | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) { setLoading(false); return; }
    const u = JSON.parse(userStr);
    setUser(u);

    async function fetchStats() {
      try {
        const res  = await fetch(`${API_BASE_URL}/analytics/dashboard/${u.id}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="ai-loader" style={{ justifyContent: "center", marginBottom: "1rem" }}>
            <div className="dot" /><div className="dot" /><div className="dot" />
          </div>
          <p style={{ color: "var(--muted)" }}>Loading your learning analytics...</p>
        </div>
      </div>
    );
  }

  /* ── Not logged in ── */
  if (!user) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 64px)", display: "flex",
          flexDirection: "column", justifyContent: "center", alignItems: "center",
          gap: "1.5rem", padding: "2rem", textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3rem" }}>📊</div>
        <h2 style={{ color: "white", fontSize: "1.75rem" }}>Track your progress</h2>
        <p style={{ color: "var(--muted)" }}>Log in to see your learning analytics and mock test scores.</p>
        <Link href="/login" className="btn-primary">Login</Link>
      </div>
    );
  }

  /* ── No data yet ── */
  if (!stats) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: "900px" }}>
          <h1 className="gradient-text fade-up" style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Learning Analytics
          </h1>
          <p style={{ color: "var(--muted)", marginBottom: "3rem" }}>Real-time insights into your professional growth.</p>

          <div className="glass-panel fade-up delay-1" style={{ padding: "3rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
            <h2 style={{ color: "white", marginBottom: "1rem" }}>No analytics yet</h2>
            <p style={{ color: "var(--muted)", marginBottom: "2rem", maxWidth: "440px", margin: "0 auto 2rem" }}>
              Complete your career profile, explore your roadmap and take a mock test — then come back here to see your progress!
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/roadmap" className="btn-primary">🗺️ View Roadmap</Link>
              <Link href="/mocktest" className="btn-ghost">🧪 Take Mock Test</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pct = stats.progress_stats?.progress_percentage ?? 0;
  const completed = stats.progress_stats?.completed_count ?? 0;
  const total     = stats.progress_stats?.total_count ?? 0;
  const testScore = stats.latest_test_score ?? 0;
  const status    = stats.status ?? "In Progress";

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: "960px" }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: "0.75rem" }}>📊 Live Analytics</div>
            <h1 className="gradient-text" style={{ fontSize: "2.75rem", fontWeight: 800 }}>
              Learning Analytics
            </h1>
            <p style={{ color: "var(--muted)", marginTop: "0.4rem" }}>
              Real-time insights into your professional growth, {user.username}.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/roadmap"  className="btn-ghost" style={{ padding: "0.55rem 1.1rem", fontSize: "0.85rem" }}>🗺️ Roadmap</Link>
            <Link href="/mocktest" className="btn-primary" style={{ padding: "0.55rem 1.1rem", fontSize: "0.85rem" }}>🧪 Take Test</Link>
          </div>
        </div>

        {/* ── KPI Row ── */}
        <div
          className="fade-up delay-1"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}
        >
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--primary)" }}>{pct}%</div>
            <div className="stat-label">Mastery Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--secondary)" }}>
              {completed}<span style={{ fontSize: "1.25rem", color: "var(--muted)" }}>/{total}</span>
            </div>
            <div className="stat-label">Skills Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--success)" }}>{testScore}%</div>
            <div className="stat-label">Latest Test Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--warning)" }}>
              {status === "Career Ready" ? "🏆" : "🔥"}
            </div>
            <div className="stat-label" style={{ color: status === "Career Ready" ? "var(--success)" : "var(--muted)" }}>
              {status}
            </div>
          </div>
        </div>

        {/* ── Progress Bar Card ── */}
        <div className="glass-panel fade-up delay-2" style={{ padding: "2.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ color: "white", fontSize: "1.1rem", fontWeight: 600 }}>Overall Mastery</h3>
            <span className={pct >= 100 ? "badge badge-success" : pct >= 50 ? "badge badge-primary" : "badge badge-secondary"}>
              {pct >= 100 ? "🏆 Career Ready" : pct >= 50 ? "🔥 Good Progress" : "🌱 Keep Going"}
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.6rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>0%</span>
            <span style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 700 }}>{pct}%</span>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>100%</span>
          </div>
          <p style={{ color: "var(--muted)", marginTop: "1.25rem", fontSize: "0.9rem", lineHeight: 1.6 }}>
            {status === "Career Ready"
              ? "🎉 Congratulations! You have mastered all identified skills in your current roadmap. Time to apply!"
              : `You've completed ${completed} out of ${total} skills. Keep following your personalised roadmap to unlock your full potential.`}
          </p>
        </div>

        {/* ── Latest Test Score Card ── */}
        <div className="glass-panel fade-up delay-3" style={{ padding: "2.5rem", marginBottom: "1.5rem" }}>
          <h3 style={{ color: "white", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.5rem" }}>
            🧪 Latest Mock Test Performance
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            {/* Circular score */}
            <div style={{ position: "relative", width: "100px", height: "100px", flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: "100px", height: "100px", transform: "rotate(-90deg)" }}>
                <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="16" fill="none"
                  stroke={testScore >= 70 ? "var(--success)" : testScore >= 40 ? "var(--primary)" : "var(--danger)"}
                  strokeWidth="3"
                  strokeDasharray={`${(testScore / 100) * 100} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div
                style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.3rem", fontWeight: 800,
                  color: testScore >= 70 ? "var(--success)" : testScore >= 40 ? "var(--primary)" : "var(--danger)",
                }}
              >
                {testScore}%
              </div>
            </div>
            <div>
              <p style={{ color: "white", fontWeight: 600, fontSize: "1.05rem", marginBottom: "0.5rem" }}>
                {testScore >= 70 ? "Excellent! You're on track 🚀" : testScore >= 40 ? "Good effort! Keep practising 💪" : "More practice needed. The AI Mentor can help! 🤖"}
              </p>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                Continue taking mock tests to improve your score and solidify your knowledge.
              </p>
              <Link href="/mocktest" className="btn-primary" style={{ display: "inline-flex", marginTop: "1rem", padding: "0.6rem 1.25rem", fontSize: "0.875rem" }}>
                Take Another Test →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div
          className="fade-up delay-4"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}
        >
          {[
            { href: "/roadmap",  icon: "🗺️", label: "Continue Roadmap",  color: "var(--primary)" },
            { href: "/chat",     icon: "🤖", label: "Ask AI Mentor",     color: "var(--secondary)" },
            { href: "/mocktest", icon: "🧪", label: "Practice Test",     color: "var(--warning)" },
            { href: "/profile",  icon: "👤", label: "Update Profile",    color: "var(--success)" },
          ].map((a) => (
            <Link key={a.href} href={a.href} style={{ textDecoration: "none" }} className="glass-card">
              <div style={{ padding: "1.25rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{a.icon}</div>
                <div style={{ color: a.color, fontSize: "0.875rem", fontWeight: 600 }}>{a.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
