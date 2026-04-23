"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import Link from "next/link";

export default function InterviewPrep() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [prepData, setPrepData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrep = async () => {
      try {
        const userDataStr = localStorage.getItem("user");
        if (!userDataStr) {
          router.push("/login");
          return;
        }

        const userId = JSON.parse(userDataStr).id;
        
        // Fetch profile to get career and skills
        const profileRes = await fetch(`${API_BASE_URL}/profile/${userId}`);
        if (!profileRes.ok) throw new Error("Could not load profile. Please complete onboarding.");
        const profileData = await profileRes.json();
        
        if (!profileData.domain) {
          throw new Error("No career domain found. Please complete your profile.");
        }

        // Fetch interview prep
        const career = encodeURIComponent(profileData.domain);
        const skills = encodeURIComponent(profileData.skills || "");
        
        const prepRes = await fetch(`${API_BASE_URL}/interview/?career=${career}&skills=${skills}`);
        if (!prepRes.ok) throw new Error("Failed to load interview materials.");
        
        const data = await prepRes.json();
        setPrepData(data);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrep();
  }, [router]);

  return (
    <div className="page-wrapper" style={{ padding: "3rem 1.5rem" }}>
      <div className="container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: "0.5rem" }}>AI Career Coach</div>
            <h1 className="gradient-text" style={{ fontSize: "2.5rem", fontWeight: 800 }}>Interview Preparation</h1>
            <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>Customized questions and scenarios based on your chosen career path.</p>
          </div>
          <Link href="/dashboard" className="btn-ghost">
            ← Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "2rem" }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ padding: "4rem 0", textAlign: "center" }}>
            <div className="ai-loader" style={{ margin: "0 auto" }}>
              <div className="dot"></div><div className="dot"></div><div className="dot"></div>
            </div>
            <p style={{ marginTop: "1rem", color: "var(--primary)" }}>Generating your personalized interview kit...</p>
          </div>
        ) : prepData && (
          <div style={{ display: "grid", gap: "2rem" }}>
            
            {/* Expert Tips */}
            <div className="glass-panel" style={{ padding: "2rem", borderLeft: "4px solid #f59e0b" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                💡 Expert Tips for Success
              </h2>
              <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.8rem" }}>
                {prepData.expert_tips?.map((tip: string, idx: number) => (
                  <li key={idx} style={{ display: "flex", gap: "0.8rem", color: "var(--muted)" }}>
                    <span style={{ color: "#f59e0b" }}>✦</span> {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {/* Technical Questions */}
              <div className="glass-panel" style={{ padding: "2rem", borderTop: "4px solid var(--primary)" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem" }}>⚙️ Technical Questions</h2>
                <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "1rem" }}>
                  {prepData.technical_questions?.map((q: string, idx: number) => (
                    <li key={idx} style={{ padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Behavioral Questions */}
              <div className="glass-panel" style={{ padding: "2rem", borderTop: "4px solid var(--secondary)" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem" }}>🤝 Behavioral Questions</h2>
                <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "1rem" }}>
                  {prepData.behavioral_questions?.map((q: string, idx: number) => (
                    <li key={idx} style={{ padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mock Scenario */}
            <div className="glass-card fade-up" style={{ padding: "2.5rem", textAlign: "center", background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(0,240,255,0.05))" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>🎯 Mock Scenario</h2>
              <p style={{ color: "var(--muted)", lineHeight: 1.8, fontSize: "1.1rem", fontStyle: "italic", maxWidth: "800px", margin: "0 auto" }}>
                "{prepData.mock_scenario}"
              </p>
              <div style={{ marginTop: "2rem" }}>
                <Link href="/chat" className="btn-primary">
                  Practice This Scenario with AI
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
