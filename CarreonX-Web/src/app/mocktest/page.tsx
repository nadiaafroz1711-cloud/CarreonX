"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

type GenerateMockTestResponse = {
  questions?: Question[];
};

export default function MockTestPage() {
  const [subject, setSubject]       = useState("AI Architecture");
  const [questions, setQuestions]   = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers]       = useState<Record<number, string>>({});
  const [score, setScore]           = useState<number | null>(null);
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId]         = useState<number | null>(null);
  const [started, setStarted]       = useState(false);
  const [error, setError]           = useState("");

  const SUBJECTS = [
    "AI Architecture",
    "Data Science",
    "Web Development",
    "Cloud Computing",
    "Cyber Security",
    "DevOps Engineering",
    "Product Management",
    "UI/UX Design",
  ];

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setUserId(JSON.parse(userStr).id);
  }, []);

  const loadTest = async () => {
    setLoading(true);
    setError("");
    setAnswers({});
    setCurrentIdx(0);
    setScore(null);
    try {
      const res  = await fetch(`${API_BASE_URL}/mocktest/generate?subject=${encodeURIComponent(subject)}`);
      const data: GenerateMockTestResponse = await res.json();
      if (!data.questions?.length) throw new Error("No questions returned.");
      setQuestions(data.questions);
      setStarted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not load test. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) finalScore++;
    });
    setSubmitting(true);
    try {
      await fetch(`${API_BASE_URL}/mocktest/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId ?? 1,
          subject,
          score: finalScore,
          total_questions: questions.length,
        }),
      });
    } catch {
      /* still show score even if db fails */
    } finally {
      setScore(finalScore);
      setSubmitting(false);
    }
  };

  const pct = questions.length > 0 ? Math.round(((currentIdx + 1) / questions.length) * 100) : 0;

  /* ── START SCREEN ── */
  if (!started) {
    return (
      <div className="page-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)" }}>
        <div className="glass-panel fade-up" style={{ maxWidth: "600px", width: "100%", padding: "3rem", textAlign: "center" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🧪</div>
          <h1 className="gradient-text" style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "0.75rem" }}>
            Mock Test
          </h1>
          <p style={{ color: "var(--muted)", marginBottom: "2rem", lineHeight: 1.6 }}>
            AI-generated questions tailored to your chosen subject. Test your knowledge and track your score.
          </p>

          {error && <div className="alert alert-error" style={{ marginBottom: "1.5rem" }}>{error}</div>}

          <div style={{ marginBottom: "2rem" }}>
            <label className="form-label" style={{ textAlign: "left" }}>Choose a Subject</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginTop: "0.5rem" }}>
              {SUBJECTS.map((s) => (
                <div
                  key={s}
                  onClick={() => setSubject(s)}
                  style={{
                    padding: "0.8rem",
                    borderRadius: "var(--radius-sm)",
                    background: subject === s ? "var(--primary-dim)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${subject === s ? "rgba(0,240,255,0.4)" : "rgba(255,255,255,0.07)"}`,
                    color: subject === s ? "white" : "var(--muted)",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    textAlign: "center",
                    fontWeight: subject === s ? 700 : 400,
                    transition: "var(--transition)",
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={loadTest}
            className="btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: "1rem" }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                <span className="spinner" style={{ width: "18px", height: "18px" }} /> Generating questions...
              </span>
            ) : (
              "Start Test ➤"
            )}
          </button>

          <div className="divider" />
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            {[
              { icon: "🤖", label: "AI-Generated" },
              { icon: "📊", label: "Score Tracked" },
              { icon: "💡", label: "Learn as you go" },
            ].map((f) => (
              <div key={f.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem" }}>{f.icon}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── RESULTS SCREEN ── */
  if (score !== null) {
    const pctScore = Math.round((score / questions.length) * 100);
    const grade =
      pctScore >= 80 ? { label: "Excellent!", color: "var(--success)", icon: "🏆" } :
      pctScore >= 60 ? { label: "Good Work!", color: "var(--primary)", icon: "🎯" } :
      pctScore >= 40 ? { label: "Keep Practising", color: "var(--warning)", icon: "💪" } :
                       { label: "Needs Work", color: "var(--danger)", icon: "📚" };

    return (
      <div className="page-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)" }}>
        <div className="glass-panel fade-up" style={{ maxWidth: "560px", width: "100%", padding: "3.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{grade.icon}</div>
          <h1 className="gradient-text" style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            {grade.label}
          </h1>
          <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>Subject: <strong style={{ color: "white" }}>{subject}</strong></p>

          {/* Score ring */}
          <div style={{ position: "relative", width: "140px", height: "140px", margin: "0 auto 2rem" }}>
            <svg viewBox="0 0 36 36" style={{ width: "140px", height: "140px", transform: "rotate(-90deg)" }}>
              <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke={grade.color}
                strokeWidth="3"
                strokeDasharray={`${(pctScore / 100) * 87.96} 87.96`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "2rem", fontWeight: 900, color: grade.color }}>{pctScore}%</span>
              <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{score}/{questions.length}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <button onClick={() => { setStarted(false); setScore(null); }} className="btn-primary">
              🔄 Try Again
            </button>
            <Link href="/progress" className="btn-ghost">📊 View Progress</Link>
            <Link href="/chat" className="btn-ghost">🤖 Ask Mentor</Link>
          </div>

          <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
            {pctScore >= 60
              ? "Great score! Continue your roadmap to keep improving."
              : "The AI Mentor can explain any topic you struggled with. Just ask!"}
          </p>
        </div>
      </div>
    );
  }

  /* ── QUESTION SCREEN ── */
  const q = questions[currentIdx];

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: "820px" }}>

        {/* Header */}
        <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "white" }}>🧪 {subject}</h1>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
              Question {currentIdx + 1} of {questions.length}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span className="badge badge-primary">{Object.keys(answers).length}/{questions.length} answered</span>
          </div>
        </div>

        {/* Progress */}
        <div className="progress-track fade-up delay-1" style={{ marginBottom: "2rem" }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>

        {/* Question Card */}
        <div className="glass-panel fade-in" style={{ padding: "2.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "2rem" }}>
            <span
              style={{
                background: "var(--primary-dim)", color: "var(--primary)",
                borderRadius: "8px", padding: "0.3rem 0.7rem",
                fontSize: "0.8rem", fontWeight: 700, flexShrink: 0, marginTop: "3px",
              }}
            >
              Q{currentIdx + 1}
            </span>
            <h3 style={{ color: "white", fontSize: "1.2rem", lineHeight: 1.5, fontWeight: 600 }}>
              {q.question}
            </h3>
          </div>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            {q.options.map((opt) => {
              const sel = answers[currentIdx] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setAnswers({ ...answers, [currentIdx]: opt })}
                  style={{
                    padding: "1.1rem 1.5rem",
                    textAlign: "left",
                    background: sel ? "var(--primary-dim)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${sel ? "rgba(0,240,255,0.5)" : "rgba(255,255,255,0.08)"}`,
                    color: sel ? "white" : "var(--muted)",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    transition: "var(--transition)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    boxShadow: sel ? "0 0 12px rgba(0,240,255,0.15)" : "none",
                  }}
                  onMouseOver={(e) => { if (!sel) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseOut={(e)  => { if (!sel) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                >
                  {sel && <span style={{ color: "var(--primary)", marginRight: "0.5rem" }}>✓</span>}
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
            className="btn-ghost"
            style={{ opacity: currentIdx === 0 ? 0.3 : 1 }}
          >
            ← Previous
          </button>

          <button
            onClick={() => { setStarted(false); setScore(null); }}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "0.85rem", fontFamily: "var(--font-body)" }}
          >
            Quit Test
          </button>

          {currentIdx < questions.length - 1 ? (
            <button
              className="btn-primary"
              onClick={() => setCurrentIdx(currentIdx + 1)}
              disabled={!answers[currentIdx]}
              style={{ opacity: !answers[currentIdx] ? 0.5 : 1 }}
            >
              Next →
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!answers[currentIdx] || submitting}
              style={{ opacity: !answers[currentIdx] ? 0.5 : 1 }}
            >
              {submitting ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="spinner" style={{ width: "16px", height: "16px" }} /> Submitting...
                </span>
              ) : (
                "🏁 Finish Test"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
