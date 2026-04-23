"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

type User = {
  id: number;
  username: string;
  email: string;
};

type Profile = {
  domain?: string;
  skills?: string[] | string;
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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<Array<{ title: string; platform: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(savedUser) as User;
    setUser(parsedUser);

    async function loadDashboard() {
      try {
        const [profileRes, statsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/profile/${parsedUser.id}`),
          fetch(`${API_BASE_URL}/analytics/dashboard/${parsedUser.id}`),
        ]);

        const profileJson = profileRes.ok ? await profileRes.json() : null;
        const statsJson = statsRes.ok ? await statsRes.json() : null;

        setProfile(profileJson);
        setStats(statsJson);

        if (profileJson?.domain) {
          const courseRes = await fetch(
            `${API_BASE_URL}/courses/recommend?career=${encodeURIComponent(profileJson.domain)}`
          );
          const courseJson = courseRes.ok ? await courseRes.json() : null;
          setCourses(courseJson?.courses || []);
        }
      } catch (error) {
        console.error("Dashboard load failed", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const skills = useMemo(() => {
    if (!profile?.skills) return [];
    return Array.isArray(profile.skills)
      ? profile.skills
      : profile.skills.split(",").map((item) => item.trim()).filter(Boolean);
  }, [profile]);

  if (loading) {
    return (
      <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="ai-loader"><div className="dot" /><div className="dot" /><div className="dot" /></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="glass-panel" style={{ maxWidth: "640px", padding: "2.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }} className="gradient-text">CarreonX</div>
          <h1 style={{ color: "white", fontSize: "2rem", marginBottom: "0.75rem" }}>Your AI Career Platform</h1>
          <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
            Sign in to access authentication, profile setup, career recommendations, learning roadmap, courses, mock tests, chatbot mentoring, and analytics.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/login" className="btn-primary">Login</Link>
            <Link href="/signup" className="btn-ghost">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = stats?.progress_stats?.progress_percentage ?? 0;
  const completed = stats?.progress_stats?.completed_count ?? 0;
  const total = stats?.progress_stats?.total_count ?? 0;
  const latestScore = stats?.latest_test_score ?? 0;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: "1100px" }}>
        <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: "0.75rem" }}>CarreonX Control Center</div>
            <h1 className="gradient-text" style={{ fontSize: "clamp(2.2rem, 6vw, 3.5rem)", fontWeight: 900 }}>
              Welcome back, {user.username}
            </h1>
            <p style={{ color: "var(--muted)", marginTop: "0.5rem", maxWidth: "680px", lineHeight: 1.6 }}>
              This dashboard brings your full roadmap together: auth, profile, recommendations, learning roadmap, courses, mock tests, mentor chat, and progress tracking.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/onboarding" className="btn-ghost" style={{ padding: "0.6rem 1rem" }}>Update Profile</Link>
            <Link href="/roadmap" className="btn-primary" style={{ padding: "0.6rem 1rem" }}>Open Roadmap</Link>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--primary)" }}>{progress}%</div>
            <div className="stat-label">Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--secondary)" }}>{skills.length}</div>
            <div className="stat-label">Skills Listed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--success)" }}>{latestScore}%</div>
            <div className="stat-label">Latest Test Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--warning)", fontSize: "1.5rem" }}>{stats?.status || "Setup"}</div>
            <div className="stat-label">Current Status</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <div className="glass-panel fade-up delay-1" style={{ padding: "2rem" }}>
            <h2 style={{ color: "white", fontSize: "1.2rem", marginBottom: "1rem" }}>Roadmap Snapshot</h2>
            <p style={{ color: "var(--muted)", marginBottom: "1rem", lineHeight: 1.6 }}>
              {profile?.domain
                ? `Target domain: ${profile.domain}. You have completed ${completed} of ${total} tracked roadmap milestones.`
                : "Complete onboarding to unlock personalized roadmap phases and recommendations."}
            </p>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem", color: "var(--muted)", fontSize: "0.8rem" }}>
              <span>{completed} completed</span>
              <span>{total} total milestones</span>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
              <Link href="/roadmap" className="btn-primary">Continue Learning</Link>
              <Link href="/progress" className="btn-ghost">View Analytics</Link>
            </div>
          </div>

          <div className="glass-panel fade-up delay-2" style={{ padding: "2rem" }}>
            <h2 style={{ color: "white", fontSize: "1.2rem", marginBottom: "1rem" }}>Profile Summary</h2>
            <div style={{ display: "grid", gap: "0.9rem" }}>
              <div>
                <div className="form-label">Email</div>
                <div style={{ color: "var(--foreground)" }}>{user.email}</div>
              </div>
              <div>
                <div className="form-label">Domain</div>
                <div style={{ color: "var(--foreground)" }}>{profile?.domain || "Not selected yet"}</div>
              </div>
              <div>
                <div className="form-label">Skills</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.4rem" }}>
                  {skills.length > 0 ? skills.slice(0, 6).map((skill) => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  )) : <span style={{ color: "var(--muted)" }}>Add skills in onboarding</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <div className="glass-panel fade-up delay-3" style={{ padding: "2rem" }}>
            <h2 style={{ color: "white", fontSize: "1.2rem", marginBottom: "1rem" }}>Recommended Courses</h2>
            {courses.length > 0 ? (
              <div style={{ display: "grid", gap: "0.85rem" }}>
                {courses.slice(0, 3).map((course) => (
                  <div key={`${course.title}-${course.platform}`} className="glass-card" style={{ padding: "1rem" }}>
                    <div style={{ color: "white", fontWeight: 700 }}>{course.title}</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>{course.platform}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
                Course recommendations will appear here after you choose a target domain in onboarding.
              </p>
            )}
            <Link href="/courses" className="btn-ghost" style={{ display: "inline-flex", marginTop: "1rem" }}>
              View All Courses
            </Link>
          </div>

          <div className="glass-panel fade-up delay-4" style={{ padding: "2rem" }}>
            <h2 style={{ color: "white", fontSize: "1.2rem", marginBottom: "1rem" }}>Action Hub</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.85rem" }}>
              {[
                { href: "/chat", label: "AI Mentor", copy: "Career advice and next steps" },
                { href: "/mocktest", label: "Mock Tests", copy: "Practice and score tracking" },
                { href: "/roadmap", label: "Roadmap", copy: "Phase-by-phase learning plan" },
                { href: "/interview", label: "Interview Prep", copy: "AI questions & mock scenarios" },
                { href: "/jobs", label: "Job Matcher", copy: "AI-curated market opportunities" },
                { href: "/profile", label: "Profile", copy: "Review your details" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="glass-card hover-lift" style={{ padding: "1rem", textDecoration: "none" }}>
                  <div style={{ color: "white", fontWeight: 700, marginBottom: "0.35rem" }}>{item.label}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.5 }}>{item.copy}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
