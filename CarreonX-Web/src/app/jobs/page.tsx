"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import Link from "next/link";

export default function JobsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
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

        // Fetch jobs
        const career = encodeURIComponent(profileData.domain);
        const skills = encodeURIComponent(profileData.skills || "");
        
        const jobsRes = await fetch(`${API_BASE_URL}/jobs/?career=${career}&skills=${skills}`);
        if (!jobsRes.ok) throw new Error("Failed to load job recommendations.");
        
        const data = await jobsRes.json();
        setJobData(data);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [router]);

  return (
    <div className="page-wrapper" style={{ padding: "3rem 1.5rem" }}>
      <div className="container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="badge badge-secondary" style={{ marginBottom: "0.5rem" }}>Market Insights</div>
            <h1 className="gradient-text" style={{ fontSize: "2.5rem", fontWeight: 800 }}>Job Matcher</h1>
            <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>AI-curated job roles and market opportunities tailored to your skills.</p>
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
            <p style={{ marginTop: "1rem", color: "var(--primary)" }}>Analyzing the job market for your profile...</p>
          </div>
        ) : jobData && (
          <div style={{ display: "grid", gap: "2rem" }}>
            
            {/* Top Roles */}
            <div className="glass-panel" style={{ padding: "2rem", borderLeft: "4px solid var(--primary)" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem" }}>
                🎯 Target Roles For You
              </h2>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {jobData.job_roles?.map((role: string, idx: number) => (
                  <span key={idx} style={{ background: "rgba(0, 240, 255, 0.1)", color: "var(--primary)", padding: "0.5rem 1rem", borderRadius: "100px", border: "1px solid rgba(0, 240, 255, 0.2)", fontWeight: 600 }}>
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Mock Listings */}
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem" }}>💼 Matched Opportunities</h2>
              <div style={{ display: "grid", gap: "1.5rem" }}>
                {jobData.mock_listings?.map((job: any, idx: number) => (
                  <div key={idx} className="glass-card fade-up" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", animationDelay: `${idx * 0.1}s` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                      <div>
                        <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "white", marginBottom: "0.25rem" }}>{job.title}</h3>
                        <p style={{ color: "var(--muted)", fontWeight: 600 }}>🏢 {job.company}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "#4ade80", fontWeight: 800, fontSize: "1.1rem" }}>{job.match_percentage}% Match</div>
                        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.2rem" }}>Based on your skills</p>
                      </div>
                    </div>
                    
                    <div style={{ padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <p style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>{job.description}</p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
                      <span style={{ color: "white", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        💰 {job.salary_range}
                      </span>
                      <button className="btn-primary" style={{ padding: "0.5rem 1.5rem", fontSize: "0.9rem" }}>
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Advice */}
            <div className="glass-panel" style={{ padding: "2rem", borderTop: "4px solid var(--secondary)", textAlign: "center", marginTop: "1rem" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem" }}>📈 Strategic Advice</h2>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, maxWidth: "800px", margin: "0 auto" }}>
                {jobData.advice}
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
