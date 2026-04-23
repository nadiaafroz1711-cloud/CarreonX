"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="page-wrapper" style={{ minHeight: "100vh", padding: 0 }}>
      {/* NAVBAR */}
      <nav style={{ 
        position: "fixed", top: 0, width: "100%", zIndex: 100, 
        background: "rgba(10, 10, 10, 0.8)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "1rem 2rem"
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 900, letterSpacing: "-1px" }}>
            CARREON<span style={{ color: "var(--primary)" }}>X</span>
          </div>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <Link href="/login" className="btn-ghost" style={{ fontSize: "0.9rem" }}>Login</Link>
            <Link href="/signup" className="btn-primary" style={{ padding: "0.6rem 1.5rem", fontSize: "0.9rem" }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{ 
        padding: "10rem 2rem 6rem", textAlign: "center", 
        background: "radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.05) 0%, transparent 50%)"
      }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <div className="badge badge-primary fade-up" style={{ marginBottom: "1.5rem" }}>AI-Powered Career Guidance</div>
          <h1 className="gradient-text fade-up delay-1" style={{ fontSize: "clamp(3rem, 8vw, 5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.5rem" }}>
            Architect Your Future <br/> With Precision AI.
          </h1>
          <p className="fade-up delay-2" style={{ color: "var(--muted)", fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto 2.5rem", lineHeight: 1.6 }}>
            The ultimate ecosystem for modern professionals. Personalized roadmaps, real-time code execution, and AI mentorship — all in one place.
          </p>
          <div className="fade-up delay-3" style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link href="/signup" className="btn-primary" style={{ padding: "1.2rem 3rem", fontSize: "1.1rem" }}>
              Start Your Journey
            </Link>
            <Link href="/project-status" className="btn-ghost" style={{ padding: "1.2rem 2rem", fontSize: "1.1rem" }}>
              View Project Status
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section style={{ padding: "6rem 2rem" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>Everything you need to scale.</h2>
            <p style={{ color: "var(--muted)" }}>A complete suite of tools designed for the next generation of talent.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {[
              { title: "AI Roadmaps", desc: "12-phase granular learning paths tailored to your specific career goals and skill level.", icon: "🗺️", color: "var(--primary)" },
              { title: "Code Sandbox", desc: "Execute real Python code directly in your browser with our integrated terminal environment.", icon: "💻", color: "var(--success)" },
              { title: "AI Mentor", desc: "A constant companion powered by Gemini AI to answer your questions and guide your study sessions.", icon: "🤖", color: "var(--secondary)" },
              { title: "Mock Tests", desc: "AI-generated quizzes to validate your skills and track your progress through each phase.", icon: "🧪", color: "var(--warning)" },
              { title: "Student Notebook", desc: "A markdown-supported workspace to document your findings and keep your learning organized.", icon: "📝", color: "#a855f7" },
              { title: "Skill Analytics", desc: "Visual progress tracking and skill-gap analysis to keep you focused on what matters.", icon: "📊", color: "#f43f5e" },
            ].map((feature, i) => (
              <div key={i} className="glass-panel fade-up" style={{ padding: "2.5rem", borderTop: `4px solid ${feature.color}` }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>{feature.icon}</div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem", color: "white" }}>{feature.title}</h3>
                <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "4rem 2rem", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
        <div className="container">
          <div style={{ fontSize: "1.25rem", fontWeight: 900, marginBottom: "1rem" }}>
            CARREON<span style={{ color: "var(--primary)" }}>X</span>
          </div>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>© 2026 CarreonX AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
