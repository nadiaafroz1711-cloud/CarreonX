"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

const TABS = [
  { key: "roadmap",   label: "🗺️ Roadmap" },
  { key: "skills",    label: "🎯 Skills Gap" },
  { key: "interview", label: "🎤 Interview Prep" },
  { key: "youtube",   label: "📺 Resources" },
  { key: "mocktest",  label: "🧪 Mock Test" },
];

function RoadmapContent() {
  const searchParams = useSearchParams();
  const career = searchParams.get("career") || "Software Engineer";
  const skills = searchParams.get("skills") || "Python";

  const [activeTab, setActiveTab]     = useState("roadmap");
  const [data, setData]               = useState<any>(null);
  const [youtubeData, setYoutubeData] = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError("");
      try {
        // AI Roadmap
        const roadRes = await fetch(`${API_BASE_URL}/recommendation/career`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ career, skills }),
        });
        if (!roadRes.ok) throw new Error("Could not fetch roadmap from backend.");
        const roadJson = await roadRes.json();
        setData(roadJson);

        // YouTube
        try {
          const ytRes  = await fetch(`${API_BASE_URL}/youtube/recommend?skills=${encodeURIComponent(skills)}`);
          const ytJson = await ytRes.json();
          setYoutubeData(ytJson.recommendations || []);
        } catch {
          setYoutubeData([]);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [career, skills]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "1.5rem" }}>
        <div className="ai-loader"><div className="dot" /><div className="dot" /><div className="dot" /></div>
        <p style={{ color: "var(--muted)", fontSize: "1rem" }}>
          AI is building your personalised roadmap for <strong style={{ color: "var(--primary)" }}>{career}</strong>…
        </p>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "1.5rem", padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem" }}>⚠️</div>
        <h2 style={{ color: "white" }}>Could not load roadmap</h2>
        <p className="alert alert-error" style={{ maxWidth: "500px" }}>{error}</p>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Make sure the FastAPI backend is running on port 8000.</p>
        <Link href="/" className="btn-primary">← Go Back</Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: "1040px" }}>

        {/* ── Header ── */}
        <div className="fade-up" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
            <span className="badge badge-primary">🎯 {career}</span>
            {skills.split(",").slice(0, 3).map((s) => (
              <span key={s} className="skill-tag">{s.trim()}</span>
            ))}
          </div>
          <h1 className="gradient-text" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, marginBottom: "0.75rem" }}>
            {data?.title || "Your Career Masterplan"}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "1.1rem", maxWidth: "680px", margin: "0 auto" }}>
            {data?.summary || "A curated, step-by-step roadmap tailored specifically for you."}
          </p>
        </div>

        {/* ── Tab Navigation ── */}
        <div
          className="glass-panel fade-up delay-1"
          style={{ display: "flex", padding: "0.5rem", marginBottom: "1.75rem", gap: "0.35rem", overflowX: "auto" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: "0.65rem 0.75rem",
                border: "none",
                background: activeTab === tab.key ? "var(--primary-dim)" : "transparent",
                color: activeTab === tab.key ? "var(--primary)" : "var(--muted)",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: activeTab === tab.key ? 700 : 400,
                fontSize: "0.875rem",
                transition: "var(--transition)",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-sans)",
                boxShadow: activeTab === tab.key ? "inset 0 0 0 1px rgba(0,240,255,0.25)" : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content Panel ── */}
        <div className="glass-panel fade-in" style={{ padding: "2.5rem", minHeight: "480px" }}>

          {/* ── 1. Roadmap ── */}
          {activeTab === "roadmap" && data?.phases && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700 }}>Learning Roadmap</h2>
                <span className="badge badge-success">🤖 AI Generated</span>
              </div>
              <div style={{ position: "relative", paddingLeft: "2rem" }}>
                <div style={{ position: "absolute", left: "0", top: "10px", bottom: "20px", width: "2px", background: "linear-gradient(180deg, var(--primary), var(--secondary))", borderRadius: "1px" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "2.25rem" }}>
                  {data.phases.map((phase: any, idx: number) => (
                    <div key={idx} className="slide-right" style={{ animationDelay: `${idx * 0.1}s`, position: "relative" }}>
                      {/* Timeline dot */}
                      <div style={{
                        position: "absolute", left: "-2.55rem", top: "4px",
                        width: "18px", height: "18px", borderRadius: "50%",
                        background: idx === 0 ? "var(--primary)" : "rgba(255,255,255,0.1)",
                        border: `2px solid ${idx === 0 ? "var(--primary)" : "rgba(255,255,255,0.2)"}`,
                        boxShadow: idx === 0 ? "0 0 12px var(--primary)" : "none",
                      }} />
                      <div className="glass-card" style={{ padding: "1.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                          <h3 style={{ color: "white", fontSize: "1.15rem", fontWeight: 700 }}>{phase.name}</h3>
                          <span className="badge badge-primary" style={{ fontSize: "0.7rem" }}>Phase {idx + 1}</span>
                        </div>
                        <p style={{ color: "var(--primary)", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.85rem" }}>
                          🎯 Goal: {phase.goal}
                        </p>
                        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          {phase.tasks?.map((t: string, i: number) => (
                            <li key={i} style={{ color: "var(--muted)", fontSize: "0.875rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                              <span style={{ color: "var(--primary)", flexShrink: 0 }}>✓</span>
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── 2. Skills Gap ── */}
          {activeTab === "skills" && (
            <div>
              <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.75rem" }}>🎯 Skills Gap Analysis</h2>
              {data?.recommended_skills?.length > 0 ? (
                <>
                  <p style={{ color: "var(--muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                    Based on your target career <strong style={{ color: "var(--primary)" }}>{career}</strong>, here are the skills you should focus on:
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", marginBottom: "2rem" }}>
                    {data.recommended_skills.map((skill: string, i: number) => (
                      <div
                        key={i}
                        className="glass-card"
                        style={{
                          padding: "0.75rem 1.25rem",
                          borderRadius: "100px",
                          border: "1px solid rgba(0,240,255,0.2)",
                          color: "var(--primary)",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          cursor: "default",
                        }}
                      >
                        ✦ {skill}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                  <p style={{ color: "var(--muted)" }}>No skill recommendations returned. Try adjusting your career or skills input.</p>
                </div>
              )}
              <div className="divider" />
              <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                💡 Tip: Click <strong style={{ color: "var(--foreground)" }}>AI Mentor Chat</strong> and ask "Explain {data?.recommended_skills?.[0] || 'these skills'} to me" for a deep dive.
              </p>
              <Link href="/chat" className="btn-primary" style={{ display: "inline-flex", marginTop: "1.25rem" }}>
                🤖 Open AI Mentor
              </Link>
            </div>
          )}

          {/* ── 3. Interview Prep ── */}
          {activeTab === "interview" && (
            <div>
              <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.75rem" }}>🎤 Interview Preparation</h2>
              {data?.interview_tips?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {data.interview_tips.map((tip: string, i: number) => (
                    <div key={i} className="glass-card slide-right" style={{ padding: "1.25rem", animationDelay: `${i * 0.08}s` }}>
                      <div style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
                        <span style={{
                          background: "var(--primary-dim)", color: "var(--primary)",
                          borderRadius: "6px", padding: "0.2rem 0.5rem",
                          fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
                        }}>
                          Q{i + 1}
                        </span>
                        <p style={{ color: "var(--foreground)", lineHeight: 1.65, fontSize: "0.9rem" }}>{tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <p style={{ color: "var(--muted)", marginBottom: "0.5rem" }}>
                    Your AI mentor can generate personalised interview questions for <strong style={{ color: "var(--primary)" }}>{career}</strong>. Try asking:
                  </p>
                  {[
                    `What are the top interview questions for a ${career}?`,
                    `How should I describe my ${skills} experience in an interview?`,
                    `What are common mistakes in ${career} interviews?`,
                    `Give me a mock interview question for ${career}`,
                  ].map((q, i) => (
                    <div key={i} className="glass-card" style={{ padding: "1rem 1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                        <p style={{ color: "var(--foreground)", fontSize: "0.875rem" }}>💬 {q}</p>
                        <Link
                          href={`/chat?q=${encodeURIComponent(q)}`}
                          className="btn-ghost"
                          style={{ padding: "0.35rem 0.85rem", fontSize: "0.75rem", flexShrink: 0 }}
                        >
                          Ask AI →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── 4. YouTube Resources ── */}
          {activeTab === "youtube" && (
            <div>
              <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.75rem" }}>📺 Learning Resources</h2>
              {youtubeData && youtubeData.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                  {youtubeData.map((item: any, idx: number) => (
                    <div key={idx} className="glass-card" style={{ padding: "1.5rem", borderTop: "3px solid #FF0000" }}>
                      <h4 style={{ color: "white", fontSize: "1rem", marginBottom: "0.85rem" }}>🎯 {item.skill}</h4>
                      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {item.queries?.map((q: string, i: number) => (
                          <li key={i}>
                            <a
                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "var(--secondary)", textDecoration: "none", fontSize: "0.85rem", transition: "var(--transition)", display: "flex", alignItems: "center", gap: "0.4rem" }}
                              onMouseOver={(e) => (e.currentTarget.style.color = "var(--primary)")}
                              onMouseOut={(e)  => (e.currentTarget.style.color = "var(--secondary)")}
                            >
                              ▶ {q}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                  <p style={{ color: "var(--muted)" }}>No resources available. The YouTube service may be offline.</p>
                </div>
              )}
            </div>
          )}

          {/* ── 5. Mock Test ── */}
          {activeTab === "mocktest" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1.25rem" }}>🧪</div>
              <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.85rem" }}>
                Validate Your Skills
              </h2>
              <p style={{ color: "var(--muted)", maxWidth: "520px", margin: "0 auto 2.5rem", lineHeight: 1.6 }}>
                Ready to test your knowledge for <strong style={{ color: "var(--primary)" }}>{career}</strong>?
                Our AI generates unique questions each time based on your career path.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/mocktest" className="btn-primary" style={{ padding: "0.9rem 2rem" }}>
                  Start Mock Test ➤
                </Link>
                <Link href="/progress" className="btn-ghost" style={{ padding: "0.9rem 2rem" }}>
                  View My Scores
                </Link>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "1rem",
                  marginTop: "3rem",
                  textAlign: "left",
                }}
              >
                {[
                  { icon: "🤖", title: "AI Generated", desc: "Questions crafted by AI for your career path" },
                  { icon: "⏱️", title: "Timed Tests",   desc: "Practice under real interview conditions" },
                  { icon: "📊", title: "Score Tracking", desc: "See your improvement over time" },
                  { icon: "💡", title: "Explanations",   desc: "Learn from each answer with AI insights" },
                ].map((f) => (
                  <div key={f.title} className="glass-card" style={{ padding: "1.25rem" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{f.icon}</div>
                    <h4 style={{ color: "var(--primary)", fontSize: "0.875rem", marginBottom: "0.35rem" }}>{f.title}</h4>
                    <p style={{ color: "var(--muted)", fontSize: "0.8rem", lineHeight: 1.5 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="ai-loader"><div className="dot" /><div className="dot" /><div className="dot" /></div>
        </div>
      }
    >
      <RoadmapContent />
    </Suspense>
  );
}
