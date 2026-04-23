"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type LearningResource = {
  skill: string;
  queries: string[];
  channels?: string[];
};

type YouTubeResponse = {
  recommendations?: LearningResource[];
};

function LearningContent() {
  const searchParams = useSearchParams();
  const skills = searchParams.get("skills") || "React, FastAPI, Python";
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await fetch(`${API_BASE_URL}/youtube/recommend?skills=${encodeURIComponent(skills)}`);
        const data: YouTubeResponse = await res.json();
        setResources(data.recommendations || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, [skills]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--background)' }}>
      <div className="ai-loader"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', padding: '4rem 2rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 className="gradient-text" style={{ fontSize: '3rem' }}>Learning Hub</h1>
          <p style={{ color: '#a1a1aa' }}>Curated high-quality resources for your current skill gap.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {resources.map((res, idx: number) => (
            <div key={idx} className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--secondary)' }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>{res.skill}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {res.queries.map((q: string, i: number) => (
                  <a 
                    key={i} 
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="suggestion-item"
                    style={{ 
                      margin: 0, 
                      padding: '1rem', 
                      display: 'block', 
                      textDecoration: 'none',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>📺 {q}</span>
                    <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem' }}>Top channel: {res.channels?.[0] || 'YouTube'}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel" style={{ marginTop: '4rem', padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Need personalized help?</h2>
          <p style={{ color: '#888', marginBottom: '2rem' }}>Our AI Mentor can provide specific explanations and code examples for any of these topics.</p>
          <Link href="/chat" className="btn-primary" style={{ width: 'auto' }}>Talk to AI Mentor</Link>
        </div>
      </div>
    </div>
  );
}

export default function LearningPage() {
  return (
    <Suspense fallback={<div className="ai-loader"></div>}>
      <LearningContent />
    </Suspense>
  );
}
