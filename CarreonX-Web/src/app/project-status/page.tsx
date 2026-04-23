"use client";
import { useState } from "react";
import Link from "next/link";

const PROJECT_PHASES = [
  { id: 0, title: "PHASE 0 — PROBLEM & IDEA", status: "completed", tasks: ["Define AI goal", "Identify users", "Finalize core features"] },
  { id: 1, title: "PHASE 1 — PROJECT SETUP", status: "completed", tasks: ["Next.js & FastAPI setup", "Folder structure", "Dependencies installed"] },
  { id: 2, title: "PHASE 2 — AUTHENTICATION", status: "completed", tasks: ["Signup/Login UI", "JWT token storage", "Session management"] },
  { id: 3, title: "PHASE 3 — USER PROFILE", status: "completed", tasks: ["Career interest collection", "Skill input", "Profile persistence"] },
  { id: 4, title: "PHASE 4 — SKILL APPRAISAL", status: "completed", tasks: ["Skill-based evaluation", "Strengths/Weaknesses identification"] },
  { id: 5, title: "PHASE 5 — RECOMMENDATION", status: "completed", tasks: ["Career path API logic", "Interest matching"] },
  { id: 6, title: "PHASE 6 — ROADMAP GENERATION", status: "completed", tasks: ["Dynamic roadmap generation", "Phase-wise division (12 Phases)"] },
  { id: 7, title: "PHASE 7 — LEARNING RESOURCES", status: "completed", tasks: ["Deep-link integration", "YouTube/GFG/W3Schools mapping"] },
  { id: 8, title: "PHASE 8 — PROGRESS TRACKING", status: "completed", tasks: ["Checkbox functionality", "Progress % calculation", "State persistence"] },
  { id: 9, title: "PHASE 9 — MOCK TEST SYSTEM", status: "completed", tasks: ["Dynamic quiz generation", "Score evaluation", "Performance storage"] },
  { id: 10, title: "PHASE 10 — AI CHATBOT", status: "completed", tasks: ["Gemini AI integration", "Context-based career advice"] },
  { id: 11, title: "PHASE 11 — UI/UX & DEPLOYMENT", status: "in-progress", tasks: ["Responsive design audit", "Vercel/Render deployment"] },
];

export default function ProjectStatus() {
  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: "1000px" }}>
        <div className="fade-up" style={{ marginBottom: "3rem", textAlign: "center" }}>
          <div className="badge badge-primary" style={{ marginBottom: "1rem" }}>Developer God View</div>
          <h1 className="gradient-text" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900 }}>
            Project Evolution
          </h1>
          <p style={{ color: "var(--muted)", marginTop: "0.8rem", maxWidth: "600px", margin: "0.8rem auto 0", lineHeight: 1.6 }}>
            Track the end-to-end development journey of CarreonX. From conceptualization to final deployment.
          </p>
        </div>

        <div style={{ display: "grid", gap: "1.5rem" }}>
          {PROJECT_PHASES.map((phase) => (
            <div 
              key={phase.id} 
              className="glass-panel fade-up" 
              style={{ 
                padding: "2rem", 
                borderLeft: `4px solid ${phase.status === 'completed' ? '#4ade80' : phase.status === 'in-progress' ? '#00f0ff' : '#333'}`,
                background: phase.status === 'in-progress' ? 'rgba(0, 240, 255, 0.03)' : 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3 style={{ color: "white", fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>{phase.title}</h3>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {phase.tasks.map((task) => (
                      <span key={task} style={{ fontSize: "0.7rem", color: "var(--muted)", background: "rgba(255,255,255,0.05)", padding: "0.2rem 0.6rem", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)" }}>
                        {task}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`badge ${phase.status === 'completed' ? 'badge-success' : phase.status === 'in-progress' ? 'badge-primary' : 'badge-secondary'}`}>
                  {phase.status.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <Link href="/dashboard" className="btn-primary" style={{ padding: "1rem 3rem" }}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
