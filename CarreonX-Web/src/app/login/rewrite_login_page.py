from pathlib import Path

content = '''"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";

type AuthResponse = {
  user: {
    id: number;
    username: string;
    email: string;
  };
  token: string;
  detail?: string;
};

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: AuthResponse = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Login failed. Please check your credentials.");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("auth-change"));
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,240,255,0.14),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(189,0,255,0.14),_transparent_30%),#080810] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-5xl grid gap-10 xl:grid-cols-[1.2fr_0.9fr]">
        <section className="glass-panel p-10">
          <span className="badge badge-primary">Sign in</span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Welcome back to CarreonX
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300 leading-8">
            Continue your AI-powered career journey with personalized recommendations, roadmap tracking, and mentor support.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="glass-card p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Fast access</p>
              <p className="mt-3 text-sm text-slate-300">Sign in quickly to resume your recommended roadmap and progress scores.</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Smart guidance</p>
              <p className="mt-3 text-sm text-slate-300">Keep learning with AI coaching, mock tests, and career skills tailored to you.</p>
            </div>
          </div>
        </section>

        <section className="glass-panel p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-cyan-400 to-slate-950 text-slate-950 shadow-lg shadow-cyan-500/20">
              <span className="text-3xl font-black">CX</span>
            </div>
            <p className="mt-4 text-sm uppercase tracking-[0.35em] text-cyan-300">CarreonX</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Login to your account</h2>
          </div>

          {message && (
            <div className="alert alert-info mb-6">{message}</div>
          )}

          {error && (
            <div className="alert alert-error mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                className="input-field"
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            New to CarreonX?{' '}
            <Link href="/signup" className="btn-ghost inline-flex">
              Create account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
'''

Path('page.tsx').write_text(content, encoding='utf-8')
