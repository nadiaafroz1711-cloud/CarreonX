"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",          label: "Home" },
  { href: "/roadmap",   label: "Roadmap" },
  { href: "/chat",      label: "AI Mentor" },
  { href: "/progress",  label: "Progress" },
  { href: "/mocktest",  label: "Mock Test" },
  { href: "/profile",   label: "Profile" },
];

export default function Navbar() {
  const [user, setUser]       = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onStorage = () => {
      const savedUser = localStorage.getItem("user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };
    onStorage();
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-change", onStorage);
    
    // Check every 2s as a fallback for internal state changes
    const interval = setInterval(onStorage, 2000);
    
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-change", onStorage);
      clearInterval(interval);
    };
  }, [pathname]);


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
    setUser(null);
    router.push("/login");

  };

  return (
    <nav
      className="navbar"
      style={{
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.6)" : "none",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* LOGO */}
      <Link href="/" className="nav-logo gradient-text" style={{ textDecoration: "none" }}>
        CarreonX
      </Link>

      {/* NAV LINKS */}
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`nav-link${pathname === item.href ? " active" : ""}`}
        >
          {item.label}
        </Link>
      ))}

      {/* SPACER */}
      <div className="nav-spacer" />

      {/* USER SECTION */}
      {user ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Avatar */}
          <div
            title={user.username}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "#000",
              flexShrink: 0,
            }}
          >
            {user.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <span style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem" }}>
            {user.username}
          </span>
          <button onClick={handleLogout} className="btn-danger">
            Logout
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/login" className="nav-link">
            Login
          </Link>
          <Link href="/signup" className="btn-primary" style={{ padding: "0.45rem 1.1rem", fontSize: "0.875rem" }}>
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
