"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

type Course = {
  title: string;
  platform: string;
};

export default function CoursesPage() {
  const [career, setCareer] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setLoading(false);
      return;
    }

    const user = JSON.parse(userStr);

    async function loadCourses() {
      try {
        const profileRes = await fetch(`${API_BASE_URL}/profile/${user.id}`);
        const profile = profileRes.ok ? await profileRes.json() : null;
        const selectedCareer = profile?.domain || "";
        setCareer(selectedCareer);

        if (selectedCareer) {
          const courseRes = await fetch(
            `${API_BASE_URL}/courses/recommend?career=${encodeURIComponent(selectedCareer)}`
          );
          const courseData = courseRes.ok ? await courseRes.json() : null;
          setCourses(courseData?.courses || []);
        }
      } catch (error) {
        console.error("Course fetch failed", error);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="ai-loader"><div className="dot" /><div className="dot" /><div className="dot" /></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: "960px" }}>
        <div className="fade-up" style={{ marginBottom: "2rem" }}>
          <div className="badge badge-secondary" style={{ marginBottom: "0.75rem" }}>Phase 6</div>
          <h1 className="gradient-text" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900 }}>
            Course Recommendations
          </h1>
          <p style={{ color: "var(--muted)", marginTop: "0.6rem", maxWidth: "700px", lineHeight: 1.6 }}>
            {career
              ? `These curated courses are matched to your selected domain: ${career}.`
              : "Set your career domain in onboarding to unlock personalized course recommendations."}
          </p>
        </div>

        {courses.length > 0 ? (
          <div style={{ display: "grid", gap: "1rem" }}>
            {courses.map((course) => (
              <div key={`${course.title}-${course.platform}`} className="glass-panel fade-up" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <h2 style={{ color: "white", fontSize: "1.1rem", marginBottom: "0.35rem" }}>{course.title}</h2>
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{course.platform}</p>
                  </div>
                  <span className="badge badge-primary">{career}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>
            <p style={{ color: "var(--muted)", marginBottom: "1.25rem", lineHeight: 1.6 }}>
              No course recommendations are available yet for your profile.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/onboarding" className="btn-primary">Complete Onboarding</Link>
              <Link href="/dashboard" className="btn-ghost">Go to Dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
