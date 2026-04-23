"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

const DOMAINS = [
  { label: "Web Development", icon: "🌐" },
  { label: "Data Science & AI", icon: "🤖" },
  { label: "Cyber Security", icon: "🔐" },
  { label: "Cloud Computing", icon: "☁️" },
  { label: "Product Management", icon: "📋" },
  { label: "UI/UX Design", icon: "🎨" },
  { label: "Mobile Development", icon: "📱" },
  { label: "DevOps Engineering", icon: "⚙️" },
];

const POPULAR_SKILLS: Record<string, string[]> = {
  "Web Development": ["React", "Node.js", "TypeScript", "CSS", "Next.js"],
  "Data Science & AI": ["Python", "TensorFlow", "SQL", "Pandas", "Machine Learning"],
  "Cyber Security": ["Networking", "Linux", "Python", "Ethical Hacking", "SIEM"],
  "Cloud Computing": ["AWS", "Docker", "Kubernetes", "Terraform", "Linux"],
  "Product Management": ["Agile", "Figma", "JIRA", "User Research", "OKRs"],
  "UI/UX Design": ["Figma", "User Research", "Prototyping", "Wireframing", "CSS"],
  "Mobile Development": ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
  "DevOps Engineering": ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux"],
};

type Step = 1 | 2 | 3 | 4;

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();


  const [step, setStep] = useState<Step>(1);
  const [domain, setDomain] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => {
        const currentUserId = searchParams.get("userId") || localStorage.getItem("userId") || (localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string).id : "");
        router.push(`/roadmap?career=${encodeURIComponent(domain)}&skills=${encodeURIComponent(skills.join(","))}&userId=${currentUserId}`);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [step, domain, skills, router, searchParams]);

  const suggestedSkills = domain ? (POPULAR_SKILLS[domain] || []) : [];

  const toggleSkill = (s: string) => {
    setSkills((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setCustomSkill("");
  };

  const handleFinish = async () => {
    const currentUserId = searchParams.get("userId") || localStorage.getItem("userId") || (localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string).id : null);
    if (!currentUserId) { setError("Session lost. Please sign up again."); return false; }
    if (!domain) { setError("Please select a career domain."); return false; }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/profile/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(currentUserId),
          domain,
          skills,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Could not save profile.");
      }
      return true;

    } catch (err: any) {
      setError(err.message);
      return false;
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
      <div style={{ position: "fixed", width: "500px", height: "500px", background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)", opacity: 0.07, top: "-100px", left: "-100px", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", width: "500px", height: "500px", background: "radial-gradient(circle, var(--secondary) 0%, transparent 70%)", opacity: 0.07, bottom: "-80px", right: "-80px", zIndex: 0, pointerEvents: "none" }} />

      <div className="glass-panel fade-up" style={{ maxWidth: "620px", width: "100%", padding: "3.5rem", position: "relative", zIndex: 1 }}>

        {/* ── Step Indicator ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0", marginBottom: "2.5rem" }}>
          {([1, 2, 3, 4] as number[]).map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: step >= s ? "linear-gradient(135deg, var(--primary), var(--secondary))" : "rgba(255,255,255,0.06)",
                border: step === s ? "2px solid var(--primary)" : step > s ? "none" : "2px solid rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: step >= s ? "#000" : "var(--muted)",
                fontWeight: 700, fontSize: "0.85rem",
                transition: "var(--transition)",
                boxShadow: step === s ? "0 0 14px rgba(0,240,255,0.4)" : "none",
              }}>
                {step > s ? "✓" : s}
              </div>
              {i < 3 && (
                <div style={{
                  width: "45px", height: "2px",
                  background: step > s ? "linear-gradient(90deg, var(--primary), var(--secondary))" : "rgba(255,255,255,0.08)",
                  transition: "var(--transition)",
                }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Welcome ── */}
        {step === 1 && (
          <div className="fade-in">
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👋</div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "white", marginBottom: "0.75rem", fontFamily: "var(--font-sans)" }}>
                Start Your Journey
              </h1>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "0.95rem" }}>
                Welcome to CarreonX. We are about to build your professional learning path from scratch.
              </p>
            </div>
            <div style={{ display: "grid", gap: "0.85rem", marginBottom: "2rem" }}>
              {[
                { icon: "🏫", title: "Chapter-Wise Learning", desc: "Phase-based content with 3 milestones each" },
                { icon: "💻", title: "Live Code Sandbox", desc: "Practice coding directly in your workspace" },
                { icon: "🧪", title: "Phase-Based Mock Tests", desc: "Quizzes designed around your completed chapters" },
              ].map((f) => (
                <div key={f.title} className="glass-card" style={{ padding: "1rem 1.25rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <p style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>{f.title}</p>
                    <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "0.2rem" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="btn-primary" style={{ width: "100%", padding: "1rem" }}>
              Continue Step 1 →
            </button>
          </div>
        )}

        {/* ── Step 2: Domain ── */}
        {step === 2 && (
          <div className="fade-in">
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "white", marginBottom: "0.5rem", fontFamily: "var(--font-sans)" }}>
                Step 2: Identify Your Path
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                Which professional domain are you targeting?
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "2rem" }}>
              {DOMAINS.map((d) => (
                <div
                  key={d.label}
                  onClick={() => setDomain(d.label)}
                  style={{
                    padding: "1rem",
                    borderRadius: "var(--radius-sm)",
                    background: domain === d.label ? "var(--primary-dim)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${domain === d.label ? "rgba(0,240,255,0.45)" : "rgba(255,255,255,0.07)"}`,
                    color: domain === d.label ? "white" : "var(--muted)",
                    cursor: "pointer",
                    textAlign: "center",
                    fontSize: "0.85rem",
                    fontWeight: domain === d.label ? 700 : 400,
                    transition: "var(--transition)",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>{d.icon}</div>
                  {d.label}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.85rem" }}>
              <button onClick={() => setStep(1)} className="btn-ghost" style={{ flex: 1, padding: "0.9rem" }}>← Back</button>
              <button
                onClick={() => setStep(3)}
                className="btn-primary"
                disabled={!domain}
                style={{ flex: 2, padding: "0.9rem", opacity: domain ? 1 : 0.5 }}
              >
                Continue Step 2 →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Skills ── */}
        {step === 3 && (
          <div className="fade-in">
            <div style={{ marginBottom: "1.75rem" }}>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "white", marginBottom: "0.5rem", fontFamily: "var(--font-sans)" }}>
                Step 3: Skill Appraisal
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                List your existing skills so we can identify the knowledge gap.
              </p>
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: "1.25rem" }}>⚠️ {error}</div>}

            <div style={{ marginBottom: "1.25rem" }}>
              <p className="form-label">Suggested for {domain}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                {suggestedSkills.map((s) => (
                  <div
                    key={s}
                    onClick={() => toggleSkill(s)}
                    style={{
                      padding: "0.35rem 0.9rem",
                      borderRadius: "100px",
                      background: skills.includes(s) ? "var(--primary-dim)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${skills.includes(s) ? "rgba(0,240,255,0.4)" : "rgba(255,255,255,0.1)"}`,
                      color: skills.includes(s) ? "var(--primary)" : "var(--muted)",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      transition: "var(--transition)",
                    }}
                  >
                    {skills.includes(s) && "✓ "}{s}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <p className="form-label">Add Your Own</p>
              <input
                type="text"
                className="input-field"
                placeholder="Press Enter to add skill"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSkill(); } }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.85rem" }}>
              <button onClick={() => setStep(2)} className="btn-ghost" style={{ flex: 1, padding: "0.9rem" }}>← Back</button>
              <button
                onClick={async () => {
                  setLoading(true);
                  // Save profile first
                  const ok = await handleFinish();
                  if (ok) {
                    setStep(4);
                  }
                  setLoading(false);
                }}
                className="btn-primary"
                disabled={loading}
                style={{ flex: 2, padding: "0.9rem" }}
              >
                {loading ? "Saving Profile..." : "Build My Path →"}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: AI Generation ── */}
        {step === 4 && (
          <div className="fade-in" style={{ textAlign: "center", padding: "2rem 0" }}>
            <div className="ai-loader" style={{ marginBottom: "2rem" }}>
              <div className="dot" style={{ width: "15px", height: "15px" }} />
              <div className="dot" style={{ width: "15px", height: "15px", animationDelay: "0.2s" }} />
              <div className="dot" style={{ width: "15px", height: "15px", animationDelay: "0.4s" }} />
            </div>
            <h2 className="gradient-text" style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>
              Generating Personalised Content...
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: "400px", margin: "0 auto", lineHeight: 1.6 }}>
              CarreonX AI is structuring your chapters, setting milestones, and preparing your code sandbox environment.
            </p>
            <div style={{ marginTop: "2rem" }}>
              <p style={{ color: "var(--primary)", fontSize: "0.8rem", fontWeight: 700 }}>Preparing Phase 1: Foundations...</p>
              <div className="progress-track" style={{ height: "4px", maxWidth: "300px", margin: "0.5rem auto" }}>
                <div className="progress-fill" style={{ width: "60%", background: "var(--primary)" }} />
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="ai-loader"><div className="dot" /><div className="dot" /><div className="dot" /></div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
