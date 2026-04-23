"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";

const TABS = [
  { key: "roadmap", label: "Roadmap" },
  { key: "skills", label: "Skills Gap" },
  { key: "projects", label: "Projects" },
  { key: "interview", label: "Interview Prep" },
  { key: "youtube", label: "Resources" },
  { key: "mocktest", label: "Mock Test" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

type RoadmapPhase = {
  name: string;
  tasks: string[];
};

const DOMAIN_ROADMAPS: Record<string, RoadmapPhase[]> = {
  "Web Development": [
    { name: "Phase 1: HTML5 & CSS3 Basics", tasks: ["Semantic HTML", "CSS Selectors", "Box Model", "Flexbox"] },
    { name: "Phase 2: Advanced CSS & Design", tasks: ["CSS Grid", "Animations", "Tailwind CSS", "Responsive UI"] },
    { name: "Phase 3: JavaScript Essentials", tasks: ["Variables & Types", "Arrays & Objects", "ES6+ Features", "Asynchronous JS"] },
    { name: "Phase 4: DOM & Browser APIs", tasks: ["Event Handling", "DOM Manipulation", "Local Storage", "Fetch API"] },
    { name: "Phase 5: React Foundations", tasks: ["JSX & Components", "Props & State", "Hooks (useState, useEffect)", "Context API"] },
    { name: "Phase 6: Advanced React", tasks: ["Redux Toolkit", "React Router", "Custom Hooks", "Performance Optimization"] },
    { name: "Phase 7: Backend Basics", tasks: ["Node.js Runtime", "Express.js Setup", "RESTful Routing", "Middleware"] },
    { name: "Phase 8: Database Mastery", tasks: ["SQL vs NoSQL", "MongoDB & Mongoose", "PostgreSQL Basics", "Data Modeling"] },
    { name: "Phase 9: Full Stack Integration", tasks: ["Next.js Setup", "Server Actions", "API Routes", "Hydration Errors"] },
    { name: "Phase 10: Auth & Security", tasks: ["JWT Auth", "OAuth (Google/GitHub)", "bcrypt Hashing", "Rate Limiting"] },
    { name: "Phase 11: Testing & QA", tasks: ["Unit Testing (Jest)", "E2E Testing (Cypress)", "Debugging Skills", "Code Reviews"] },
    { name: "Phase 12: DevOps & Deployment", tasks: ["Docker Basics", "CI/CD Pipelines", "Vercel/AWS Deployment", "Portfolio Finalization"] }
  ],
  "Data Science & AI": [
    { name: "Phase 1: Python for Data Science", tasks: ["Python Syntax", "Lists & Dictionaries", "Control Flow", "Functions"] },
    { name: "Phase 2: Mathematical Foundations", tasks: ["Linear Algebra", "Calculus Basics", "Probability Theory", "Descriptive Statistics"] },
    { name: "Phase 3: Data Analysis Essentials", tasks: ["SQL Fundamentals", "NumPy Operations", "Pandas DataFrames", "Data Cleaning"] },
    { name: "Phase 4: Data Visualization", tasks: ["Matplotlib", "Seaborn", "Plotly", "Storytelling with Data"] },
    { name: "Phase 5: Machine Learning - Part 1", tasks: ["Linear Regression", "Logistic Regression", "Decision Trees", "K-Nearest Neighbors"] },
    { name: "Phase 6: Machine Learning - Part 2", tasks: ["Random Forests", "Gradient Boosting", "SVM", "Model Evaluation"] },
    { name: "Phase 7: Unsupervised Learning", tasks: ["K-Means Clustering", "Hierarchical Clustering", "PCA", "Anomaly Detection"] },
    { name: "Phase 8: Natural Language Processing", tasks: ["Tokenization", "TF-IDF", "Word Embeddings", "Transformers Intro"] },
    { name: "Phase 9: Computer Vision", tasks: ["Image Processing", "OpenCV Basics", "CNN Architectures", "Object Detection"] },
    { name: "Phase 10: Deep Learning with PyTorch", tasks: ["Tensors", "Neural Networks", "Backpropagation", "Optimizers"] },
    { name: "Phase 11: Big Data & Cloud", tasks: ["Spark Basics", "AWS S3/SageMaker", "MLOps Principles", "Model Versioning"] },
    { name: "Phase 12: Expert Specialization", tasks: ["Reinforcement Learning", "Generative AI (LLMs)", "Deployment (FastAPI)", "Research Projects"] }
  ],
  "Software Engineer": [
    { name: "Phase 1: CS Fundamentals", tasks: ["Data Structures", "Algorithms", "Binary & Logic"] },
    { name: "Phase 2: Programming Deep Dive", tasks: ["Java/Python Masterclass", "Memory Management", "Concurrency"] },
    { name: "Phase 3: OOP & Design", tasks: ["Classes & Interfaces", "SOLID Principles", "Design Patterns"] },
    { name: "Phase 4: Software Design", tasks: ["UML Diagrams", "Database Schema Design", "Architecture Patterns"] },
    { name: "Phase 5: Advanced Algorithms", tasks: ["Dynamic Programming", "Graph Theory", "Greedy Algorithms"] },
    { name: "Phase 6: Web Services", tasks: ["REST APIs", "gRPC", "Microservices Architecture"] },
    { name: "Phase 7: Cloud Engineering", tasks: ["AWS Fundamentals", "Serverless Functions", "Cloud Storage"] },
    { name: "Phase 8: Containers & Orchestration", tasks: ["Docker", "Kubernetes Basics", "Helm Charts"] },
    { name: "Phase 9: Reliability Engineering", tasks: ["Monitoring (Prometheus)", "Logging", "Scalability Testing"] },
    { name: "Phase 10: Security Engineering", tasks: ["Application Security", "Threat Modeling", "Compliance"] },
    { name: "Phase 11: Team Leadership", tasks: ["Agile Methodologies", "System Design Interviews", "Mentoring"] },
    { name: "Phase 12: Expert Architect", tasks: ["Enterprise Patterns", "Cost Optimization", "Legacy Migration", "Final Project"] }
  ],
  "Cyber Security": [
    { name: "Phase 1: Networking Foundations", tasks: ["OSI Model", "TCP/IP Suite", "DNS & DHCP"] },
    { name: "Phase 2: Linux Mastery", tasks: ["Command Line Essentials", "User Permissions", "Bash Scripting"] },
    { name: "Phase 3: Security Basics", tasks: ["CIA Triad", "Threat Actors", "Encryption Basics"] },
    { name: "Phase 4: Defensive Security", tasks: ["Firewalls", "IDS/IPS Setup", "Endpoint Security"] },
    { name: "Phase 5: Vulnerability Management", tasks: ["Scanning Tools", "Risk Assessment", "Patching Strategy"] },
    { name: "Phase 6: Incident Response", tasks: ["Digital Forensics", "Log Analysis", "Malware Analysis"] },
    { name: "Phase 7: Offensive Security Intro", tasks: ["Reconnaissance", "Social Engineering", "Password Cracking"] },
    { name: "Phase 8: Web App Security", tasks: ["SQL Injection", "XSS", "CSRF Defense"] },
    { name: "Phase 9: Network Pentesting", tasks: ["Metasploit", "Wireless Auditing", "Pivot Techniques"] },
    { name: "Phase 10: Identity & Access", tasks: ["OAuth/SAML", "Active Directory Security", "Privilege Escalation"] },
    { name: "Phase 11: Compliance & Audit", tasks: ["ISO 27001", "SOC2", "GDPR Fundamentals"] },
    { name: "Phase 12: CISO Strategy", tasks: ["Security Policy", "Budgeting", "Crisis Management", "Expert Cert Prep"] }
  ]
};

const DOMAIN_RESOURCES: Record<string, { name: string; url: string; platform: string; icon: string }[]> = {
  "Web Development": [
    { name: "MDN Web Docs", url: "https://developer.mozilla.org", platform: "Documentation", icon: "📄" },
    { name: "JavaScript.info", url: "https://javascript.info", platform: "Tutorial", icon: "🟨" },
    { name: "W3Schools", url: "https://www.w3schools.com", platform: "Learning", icon: "🌐" },
    { name: "Traversy Media", url: "https://www.youtube.com/user/TechGuyWeb", platform: "YouTube", icon: "📺" },
  ],
  "Data Science & AI": [
    { name: "Kaggle", url: "https://www.kaggle.com", platform: "Datasets & Practice", icon: "📊" },
    { name: "DataCamp", url: "https://www.datacamp.com", platform: "Courses", icon: "🐍" },
    { name: "DeepLearning.AI", url: "https://www.deeplearning.ai", platform: "Specialization", icon: "🧠" },
    { name: "Sentdex", url: "https://www.youtube.com/user/sentdex", platform: "YouTube", icon: "📺" },
  ],
  "Software Engineer": [
    { name: "LeetCode", url: "https://leetcode.com", platform: "Algorithm Practice", icon: "💻" },
    { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org", platform: "CS Fundamentals", icon: "🤓" },
    { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", platform: "GitHub", icon: "🏗️" },
    { name: "HackerRank", url: "https://www.hackerrank.com", platform: "Coding Tests", icon: "🏆" },
  ],
  "Cyber Security": [
    { name: "TryHackMe", url: "https://tryhackme.com", platform: "Hands-on Lab", icon: "🛡️" },
    { name: "Hack The Box", url: "https://www.hackthebox.com", platform: "Pen-Testing", icon: "💻" },
    { name: "OWASP Top Ten", url: "https://owasp.org", platform: "Standard Security", icon: "🔍" },
    { name: "Cyberary", url: "https://www.cybrary.it", platform: "Cyber Courses", icon: "🔒" },
  ],
};

const DOMAIN_PROJECTS: Record<string, { title: string; level: string; desc: string; tech: string[] }[]> = {
  "Web Development": [
    { title: "E-Commerce Titan", level: "Advanced", desc: "Build a full-scale e-commerce platform with Stripe integration, product filtering, and admin dashboard.", tech: ["Next.js", "PostgreSQL", "Stripe", "Tailwind"] },
    { title: "Real-time Chat Engine", level: "Intermediate", desc: "A socket-based messaging app with global rooms, private chats, and typing indicators.", tech: ["Node.js", "Socket.io", "React", "Redis"] },
    { title: "AI Image Generator", level: "Expert", desc: "Integrate OpenAI DALL-E API to generate custom images based on user prompts.", tech: ["React", "Express", "OpenAI API", "Cloudinary"] },
  ],
  "Data Science & AI": [
    { title: "Stock Pulse Predictor", level: "Intermediate", desc: "Use LSTM networks to predict stock prices based on historical data and sentiment analysis.", tech: ["Python", "TensorFlow", "Pandas", "Scikit-Learn"] },
    { title: "Disease Diagnostic AI", level: "Advanced", desc: "Train a CNN model to identify anomalies in medical X-ray or MRI scans.", tech: ["PyTorch", "OpenCV", "NumPy", "Flask"] },
    { title: "Customer Churn Analyzer", level: "Beginner", desc: "Predict which customers are likely to leave a service using classification algorithms.", tech: ["Scikit-Learn", "Matplotlib", "Seaborn"] },
  ],
  "Software Engineer": [
    { title: "Custom Distributed Cache", level: "Expert", desc: "Design a high-availability in-memory cache system with replication and sharding.", tech: ["Go/C++", "Networking", "Distributed Systems"] },
    { title: "Automated Deployment CLI", level: "Intermediate", desc: "A command-line tool that automates SSH deployments and environment configuration.", tech: ["Python/Node", "SSH APIs", "Git Hooks"] },
    { title: "Code Syntax Highlighter", level: "Beginner", desc: "Create a regex-based engine that converts raw code into HTML with syntax coloring.", tech: ["JavaScript", "Regex", "HTML/CSS"] },
  ],
  "Cyber Security": [
    { title: "Intrusion Detection System", level: "Advanced", desc: "Build a tool that monitors network traffic and flags suspicious patterns using AI.", tech: ["Python", "Scapy", "Machine Learning"] },
    { title: "Encrypted Vault", level: "Intermediate", desc: "A zero-knowledge password manager using AES-256-GCM encryption.", tech: ["Rust/C++", "Cryptography", "SQLite"] },
    { title: "Phishing Simulator", level: "Beginner", desc: "A safe environment to train employees on identifying sophisticated phishing attempts.", tech: ["HTML/CSS", "PHP/Node", "Mail Server"] },
  ],
};

const CAREER_STARTER_KITS: Record<string, { notes: string; code: string }> = {
  "Web Development": {
    notes: `# 🌐 Complete Web Development Study Guide

## 1. Frontend Foundations
- **HTML5:** Semantic tags (header, main, section, footer), ARIA roles for accessibility.
- **CSS3:** Flexbox & Grid, CSS Variables, Responsive Design (Media Queries).
- **JavaScript:** ES6+ (Arrow functions, Destructuring, Promises, Async/Await), DOM API.

## 2. Frameworks & Tools
- **React.js:** Hooks (useState, useEffect, useContext), Component Lifecycle, Virtual DOM.
- **State Management:** Zustand or Redux for global application state.
- **Build Tools:** Vite, Webpack, and NPM/Yarn package management.

## 3. Backend & APIs
- **Node.js:** Event loop, Express.js middleware, RESTful API design.
- **Databases:** SQL (PostgreSQL) vs NoSQL (MongoDB).
- **Auth:** JWT (JSON Web Tokens) and Bcrypt for secure password hashing.

## 4. Deployment
- Vercel, Netlify, and basic AWS S3/CloudFront.`,
    code: "// Web Dev Practice\nconst greet = (name) => `Hello, ${name}! Welcome to CarreonX.`;\nconsole.log(greet('Student'));"
  },
  "Data Science & AI": {
    notes: `# 📊 Complete Data Science & AI Study Guide

## 1. Programming & Math
- **Python:** Lists, Dicts, List Comprehensions, Decorators, and Error Handling.
- **Statistics:** Mean, Median, Mode, Standard Deviation, P-Values, and Distributions.
- **Linear Algebra:** Matrices, Vectors, and Eigenvalues.

## 2. Data Manipulation
- **NumPy:** N-dimensional arrays and mathematical functions.
- **Pandas:** DataFrames, Series, Merging, GroupBy, and Pivot Tables.
- **Cleaning:** Handling missing values (NaN) and outlier detection.

## 3. Machine Learning
- **Supervised:** Linear Regression, Logistic Regression, Random Forest, SVM.
- **Unsupervised:** K-Means Clustering, PCA (Principal Component Analysis).
- **Deep Learning:** Neural Networks, CNNs (Images), RNNs (Sequential data).

## 4. Tools & Visuals
- **Visualization:** Matplotlib, Seaborn, and Plotly for interactive charts.
- **Deployment:** Flask/FastAPI for model APIs, Streamlit for dashboards.`,
    code: "# Python Practice\ndef filter_even(numbers):\n    return [n for n in numbers if n % 2 == 0]\n\nprint(filter_even([1, 2, 3, 4, 5, 6]))"
  },
  "Software Engineer": {
    notes: `# 💻 Complete Software Engineering Study Guide

## 1. Algorithms & Data Structures
- **DS:** Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Hash Tables.
- **Algorithms:** Sorting (Merge, Quick), Searching (Binary), Dynamic Programming.
- **Complexity:** Big O notation (Space & Time complexity analysis).

## 2. Software Design
- **OOP:** Encapsulation, Inheritance, Polymorphism, Abstraction.
- **SOLID Principles:** Single Responsibility, Open/Closed, etc.
- **Design Patterns:** Singleton, Factory, Observer, Strategy.

## 3. System Architecture
- **Distributed Systems:** Load Balancing, Microservices vs Monolith.
- **Caching:** Redis, Memcached.
- **APIs:** REST, GraphQL, gRPC.

## 4. Professional Practices
- **Version Control:** Git (Branching, Merging, Rebasing).
- **Testing:** Unit Testing (Jest, PyTest), Integration Testing.
- **CI/CD:** Jenkins, GitHub Actions, Docker, Kubernetes.`,
    code: "// Software Engineering Practice\nfunction factorial(n) {\n    if (n === 0) return 1;\n    return n * factorial(n - 1);\n}\nconsole.log(factorial(5));"
  },
  "Cyber Security": {
    notes: `# 🛡️ Complete Cyber Security Study Guide

## 1. Networking Security
- **TCP/IP:** OSI Model, Handshakes, DNS, DHCP, ICMP.
- **Protocols:** SSH, HTTPS, TLS/SSL, VPN, Firewalls.
- **Scanning:** Nmap, Wireshark packet analysis.

## 2. Defensive Security
- **SIEM:** Security Information and Event Management (Splunk, ELK).
- **Vulnerability:** Scanning (Nessus), Patch Management.
- **IAM:** Identity and Access Management, Multi-Factor Authentication (MFA).

## 3. Offensive Security
- **Penetration Testing:** Reconnaissance, Exploitation, Post-Exploitation.
- **Web App Security:** OWASP Top 10 (SQLi, XSS, CSRF, IDOR).
- **Social Engineering:** Phishing, Vishing, Pretexting.

## 4. Compliance & Ethics
- **Standards:** ISO 27001, SOC2, HIPAA, GDPR.
- **Ethics:** White Hat vs Black Hat, Legal Boundaries.`,
    code: "# Cyber Security Practice\n# Python script to check if a port is likely open\ndef check_port(port):\n    privileged = \"Privileged\" if port < 1024 else \"Non-privileged\"\n    print(f\"Port {port} is a {privileged} port.\")\n\ncheck_port(80)\ncheck_port(8080)"
  }
};

function RoadmapContent() {
  const searchParams = useSearchParams();
  const career = searchParams.get("career") || "Software Engineer";
  const skills = searchParams.get("skills") || "Python";

  // Determine roadmap data based on selected domain
  const matchedDomain = Object.keys(DOMAIN_ROADMAPS).find(k => 
    k.toLowerCase().includes(career.toLowerCase()) || 
    career.toLowerCase().includes(k.toLowerCase())
  ) || "Software Engineer";

  const phases = DOMAIN_ROADMAPS[matchedDomain];
  const domainResources = DOMAIN_RESOURCES[matchedDomain] || DOMAIN_RESOURCES["Software Engineer"];
  const domainProjects = DOMAIN_PROJECTS[matchedDomain] || DOMAIN_PROJECTS["Software Engineer"];
  const starterKit = CAREER_STARTER_KITS[matchedDomain] || CAREER_STARTER_KITS["Software Engineer"];

  const [activeTab, setActiveTab] = useState<TabKey>("roadmap");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentGlobalTaskIdx, setCurrentGlobalTaskIdx] = useState(0);
  const [isSavingProgress, setIsSavingProgress] = useState(false);

  // Load progress from backend
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const userId = localStorage.getItem("userId") || "1";
        const res = await fetch(`${API_BASE_URL}/progress/${userId}`);
        const data = await res.json();
        
        // Find the Roadmap progress
        const roadmapProgress = data.progress.find((p: any) => p.category === "roadmap");
        if (roadmapProgress) {
          setCurrentGlobalTaskIdx(Math.floor(roadmapProgress.completion_percentage));
        }
      } catch (err) {
        console.error("Failed to fetch progress", err);
      }
    };
    fetchProgress();
  }, []);

  const saveProgressToBackend = async (idx: number) => {
    setIsSavingProgress(true);
    try {
      const userId = localStorage.getItem("userId") || "1";
      await fetch(`${API_BASE_URL}/progress/update?user_id=${userId}&title=Roadmap&category=roadmap&completion_percentage=${idx}`, {
        method: "POST"
      });
    } catch (err) {
      console.error("Failed to save progress", err);
    } finally {
      setIsSavingProgress(false);
    }
  };

  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [sampleQuestion, setSampleQuestion] = useState<string | null>(null);
  const [generatingSample, setGeneratingSample] = useState(false);
  const [code, setCode] = useState("");
  const [notes, setNotes] = useState("");
  const [codeOutput, setCodeOutput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const whiteboardRef = useRef<HTMLTextAreaElement | null>(null);

  // Initialize Starter Kits
  useEffect(() => {
    setCode(starterKit.code);
    setNotes(starterKit.notes);
  }, [matchedDomain]);

  const generateSample = () => {
    setGeneratingSample(true);
    setTimeout(() => {
      setSampleQuestion("Can you explain the key concepts of your career path?");
      setGeneratingSample(false);
    }, 1000);
  };

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      setError("Session lost. Please sign up again.");
      return;
    }
    setUserId(id);
    setLoading(false);
  }, []);

  const handleSandboxRun = async () => {
    setCodeOutput("Running code...");
    try {
      const res = await fetch(`${API_BASE_URL}/sandbox/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      setCodeOutput(data.output || "No output returned.");
    } catch (err) {
      setCodeOutput("Failed to execute code. Is the backend running?");
    }
  };



  // Flatten tasks to calculate global index easily
  let globalTaskCount = 0;
  const phaseTaskBounds = phases.map(p => {
    const start = globalTaskCount;
    globalTaskCount += p.tasks.length;
    return start;
  });

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: "1040px" }}>
        <div className="fade-up" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
            <span className="badge badge-primary">{career}</span>
            {skills.split(",").slice(0, 3).map((skill) => (
              <span key={skill} className="skill-tag">{skill.trim()}</span>
            ))}
          </div>
          <h1 className="gradient-text" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, marginBottom: "0.75rem" }}>
            Your Career Masterplan
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "1.1rem", maxWidth: "680px", margin: "0 auto" }}>
            A curated, step-by-step roadmap tailored specifically for you.
          </p>
        </div>

        <div
          className="glass-panel fade-up delay-1"
          style={{ display: "flex", padding: "0.5rem", marginBottom: "1.75rem", gap: "0.35rem", overflowX: "auto" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: "0.65rem 0.75rem",
                border: "none",
                background: activeTab === tab.key ? "var(--primary-dim)" : "transparent",
                color: activeTab === tab.key ? "var(--primary)" : "var(--muted)",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: activeTab === tab.key ? 700 : 400,
                fontSize: "0.875rem",
                transition: "var(--transition)",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-sans)",
                boxShadow: activeTab === tab.key ? "inset 0 0 0 1px rgba(0,240,255,0.25)" : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="glass-panel fade-in" style={{ padding: "2.5rem", minHeight: "480px" }}>
          {activeTab === "roadmap" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700 }}>Learning Module</h2>
                <span className="badge badge-success">AI Generated</span>
              </div>

              <div style={{ background: '#111', borderRadius: '16px', overflow: 'hidden', border: '1px solid #333' }}>
                {phases.map((phase, phaseIdx) => {
                  const startGlobalIdx = phaseTaskBounds[phaseIdx];
                  
                  return (
                    <div key={phase.name}>
                      <div style={{ 
                        padding: '1.2rem 1.5rem', 
                        background: '#1a1a1a', 
                        borderBottom: '1px solid #333', 
                        borderTop: phaseIdx > 0 ? '1px solid #333' : 'none',
                        color: 'white', 
                        fontWeight: 700,
                        fontSize: '1.1rem'
                      }}>
                        {phase.name}
                      </div>
                      {phase.tasks.map((task, taskIdx) => {
                        const globalIdx = startGlobalIdx + taskIdx;
                        const isCurrentlyPlaying = globalIdx === currentGlobalTaskIdx;
                        const isCompleted = globalIdx < currentGlobalTaskIdx;
                        const statusText = isCurrentlyPlaying ? "CURRENTLY LEARNING" : isCompleted ? "COMPLETED" : "NOT STARTED";
                        
                        // Pseudo-random duration string for UI realism
                        const minutes = 5 + ((globalIdx * 7) % 15);
                        const seconds = (globalIdx * 13) % 60;
                        const timeStr = `${minutes}m ${seconds}s`;

                        return (
                          <div 
                            key={task}
                            onClick={() => setCurrentGlobalTaskIdx(globalIdx)}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              padding: '1.25rem 1.5rem', 
                              borderBottom: '1px solid #222',
                              background: isCurrentlyPlaying ? '#252525' : 'transparent',
                              cursor: 'pointer',
                              transition: 'background 0.2s'
                            }}
                          >
                            <div style={{ marginRight: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {isCurrentlyPlaying ? (
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <div style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '10px solid black', marginLeft: '4px' }}></div>
                                </div>
                              ) : isCompleted ? (
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontSize: '16px', fontWeight: 'bold' }}>
                                  ✓
                                </div>
                              ) : (
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #555' }}></div>
                              )}
                            </div>
                            
                            <div>
                              <div style={{ fontSize: '0.7rem', color: isCurrentlyPlaying ? '#ccc' : '#777', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '0.35rem' }}>
                                {statusText}
                              </div>
                              <div style={{ fontSize: '1.05rem', color: 'white', fontWeight: isCurrentlyPlaying ? 600 : 400, marginBottom: '0.25rem' }}>
                                {task}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                {timeStr}
                                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
                                  <a 
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(career + ' ' + task + ' tutorial')}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    style={{ background: isCurrentlyPlaying ? "rgba(255, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.05)", color: isCurrentlyPlaying ? "#ff6b6b" : "#aaa", padding: "0.4rem 0.8rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.75rem", fontWeight: 600, border: "1px solid rgba(255, 255, 255, 0.1)", transition: "all 0.2s" }} 
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    ▶ YouTube
                                  </a>
                                  <a 
                                    href={`https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(career + ' ' + task)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    style={{ background: isCurrentlyPlaying ? "rgba(40, 167, 69, 0.15)" : "rgba(255, 255, 255, 0.05)", color: isCurrentlyPlaying ? "#4ade80" : "#aaa", padding: "0.4rem 0.8rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.75rem", fontWeight: 600, border: "1px solid rgba(255, 255, 255, 0.1)", transition: "all 0.2s" }} 
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    📚 GFG
                                  </a>
                                  <a 
                                    href={`https://www.google.com/search?q=site:w3schools.com+${encodeURIComponent(career + ' ' + task)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    style={{ background: isCurrentlyPlaying ? "rgba(0, 240, 255, 0.1)" : "rgba(255, 255, 255, 0.05)", color: isCurrentlyPlaying ? "var(--primary)" : "#aaa", padding: "0.4rem 0.8rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.75rem", fontWeight: 600, border: "1px solid rgba(255, 255, 255, 0.1)", transition: "all 0.2s" }} 
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    🌐 W3Schools
                                  </a>
                                  {isCurrentlyPlaying && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const nextIdx = globalIdx + 1;
                                        setCurrentGlobalTaskIdx(nextIdx);
                                        saveProgressToBackend(nextIdx);
                                      }}
                                      className="btn-primary"
                                      style={{ padding: "0.4rem 1rem", fontSize: "0.75rem" }}
                                    >
                                      {isSavingProgress ? "Saving..." : "✓ Complete Step"}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div>
              <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.75rem" }}>Skills Gap Analysis</h2>
              <p style={{ color: "var(--muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                Based on your target career <strong style={{ color: "var(--primary)" }}>{career}</strong>, your current skills are:
                <br/>
                <span style={{ color: "#aaa" }}>{skills.split(",").map(s => s.trim()).join(", ") || "None"}</span>
              </p>
              
              <div className="divider" style={{ margin: "1.5rem 0", background: "rgba(255,255,255,0.1)", height: "1px" }} />
              
              <p style={{ color: "var(--muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                To reach mastery, you need to bridge the gap and focus on learning these missing skills:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", marginBottom: "2rem" }}>
                {(() => {
                  const userSkills = skills.split(",").map(s => s.trim().toLowerCase());
                  const requiredSkills = phases.flatMap(p => p.tasks);
                  const gap = requiredSkills.filter(req => 
                    !userSkills.some(userSkill => req.toLowerCase().includes(userSkill) || userSkill.includes(req.toLowerCase()))
                  );
                  
                  const displaySkills = gap.length > 0 ? gap : requiredSkills;
                  
                  return displaySkills.map((skill) => (
                    <Link
                      key={skill}
                      href={`/chat?q=${encodeURIComponent(`Explain the core concepts of ${skill} for a ${career} role.`)}`}
                      className="glass-card"
                      style={{
                        padding: "0.75rem 1.25rem",
                        borderRadius: "100px",
                        border: "1px solid rgba(0,240,255,0.2)",
                        color: "var(--primary)",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        textDecoration: "none",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = "rgba(0, 240, 255, 0.1)"; e.currentTarget.style.transform = "scale(1.05)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "scale(1)"; }}
                    >
                      {skill}
                    </Link>
                  ));
                })()}
              </div>

              <div className="divider" style={{ margin: "1.5rem 0", background: "rgba(255,255,255,0.1)", height: "1px" }} />
              <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                Tip: Click <strong style={{ color: "var(--foreground)" }}>Open AI Mentor</strong> and ask "Explain{" "}
                {phases[0]?.tasks[0] || "these skills"} to me" for a deep dive.
              </p>
              <Link href="/chat" className="btn-primary" style={{ display: "inline-flex", marginTop: "1.25rem" }}>
                Open AI Mentor
              </Link>
            </div>
          )}

          {activeTab === "projects" && (
            <div>
              <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.85rem" }}>Domain-Specific Projects</h2>
              <p style={{ color: "var(--muted)", marginBottom: "2rem", lineHeight: 1.6 }}>
                Apply your knowledge by building these high-impact projects. Great for your portfolio!
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
                {domainProjects.map((project, i) => (
                  <div key={i} className="glass-panel fade-up" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.7rem", color: project.level === 'Expert' ? 'var(--danger)' : project.level === 'Advanced' ? 'var(--warning)' : 'var(--success)', fontWeight: 800, textTransform: "uppercase" }}>{project.level}</span>
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        {project.tech.map(t => <span key={t} style={{ fontSize: "0.6rem", background: "rgba(255,255,255,0.05)", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>{t}</span>)}
                      </div>
                    </div>
                    <h3 style={{ color: "white", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>{project.title}</h3>
                    <p style={{ color: "#aaa", fontSize: "0.875rem", lineHeight: 1.6, flex: 1, marginBottom: "1.25rem" }}>{project.desc}</p>
                    <button 
                      onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(project.title + ' project tutorial using ' + project.tech.join(' '))}`, '_blank')}
                      className="btn-ghost" 
                      style={{ width: "100%", fontSize: "0.8rem" }}
                    >
                      Search Tutorial
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "interview" && (
            <div>
              <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.75rem" }}>Interview Preparation</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  `What makes a good ${career}?`,
                  `Describe a recent challenge you faced while using ${skills.split(',')[0]}.`,
                  `What are the top interview questions for a ${career}?`,
                  `Give me a mock interview question for ${career}`,
                ].map((question, idx) => (
                  <Link
                    key={idx}
                    href={`/chat?q=${encodeURIComponent(question)}`}
                    className="glass-card"
                    style={{ padding: "1.25rem", display: "block", textDecoration: "none" }}
                  >
                    <p style={{ color: "var(--foreground)", lineHeight: 1.65, fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                      {question}
                    </p>
                    <span style={{ color: "var(--primary)", fontSize: "0.75rem", opacity: 0.8 }}>Click to ask AI</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === "youtube" && (
            <div style={{ height: "calc(100vh - 350px)", minHeight: "600px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700 }}>Learning Workspace</h2>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button onClick={() => setShowWhiteboard(true)} className="btn-ghost" style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}>
                    Fullscreen Whiteboard
                  </button>
                </div>
              </div>

              {/* Resource Grid (Keep small at top) */}
              <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "1rem" }}>
                {domainResources.map((res) => (
                  <a
                    key={res.name}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card"
                    style={{ 
                      padding: "0.75rem 1.25rem", 
                      textDecoration: "none", 
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      whiteSpace: "nowrap",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      fontSize: "0.85rem"
                    }}
                  >
                    <span>{res.icon}</span>
                    <span style={{ color: "white", fontWeight: 600 }}>{res.name}</span>
                  </a>
                ))}
              </div>

              {/* SPLIT VIEW WORKSPACE */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", flex: 1 }}>
                {/* NOTEBOOK */}
                <div className="glass-card" style={{ padding: "1.5rem", borderTop: "3px solid var(--primary)", display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <h4 style={{ color: "white", fontSize: "1.1rem" }}>Student Notebook</h4>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Markdown Supported</span>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{
                      width: "100%",
                      flex: 1,
                      background: "rgba(0,0,0,0.2)",
                      color: "var(--foreground)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "8px",
                      padding: "1rem",
                      outline: "none",
                      resize: "none",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      fontFamily: "var(--font-sans)"
                    }}
                  />
                </div>

                {/* SANDBOX */}
                <div className="glass-card" style={{ padding: "1.5rem", borderTop: "3px solid var(--success)", display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <h4 style={{ color: "white", fontSize: "1.1rem" }}>Code Sandbox</h4>
                    <button onClick={handleSandboxRun} className="btn-primary" style={{ padding: "0.3rem 0.8rem", fontSize: "0.7rem" }}>
                      Run Code
                    </button>
                  </div>
                  <textarea
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    style={{
                      width: "100%",
                      flex: 1,
                      background: "#000",
                      color: "#00ff00",
                      fontFamily: "monospace",
                      padding: "1rem",
                      borderRadius: "8px",
                      border: "1px solid #333",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                  {codeOutput && (
                    <div style={{ 
                      marginTop: "1rem", 
                      padding: "0.75rem", 
                      background: "rgba(0,0,0,0.5)", 
                      borderRadius: "8px", 
                      border: "1px solid rgba(0,255,0,0.1)"
                    }}>
                      <div style={{ fontSize: "0.6rem", color: "#00ff00", marginBottom: "0.25rem", fontWeight: 700 }}>TERMINAL OUTPUT</div>
                      <pre style={{ fontSize: "0.8rem", color: "#ccc", overflowX: "auto" }}>
                        {codeOutput}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "mocktest" && (
            <div style={{ textAlign: "center" }}>
              <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.85rem" }}>
                Validate Your Skills
              </h2>
              <p style={{ color: "var(--muted)", maxWidth: "520px", margin: "0 auto 2.5rem", lineHeight: 1.6 }}>
                Ready to test your knowledge for <strong style={{ color: "var(--primary)" }}>{career}</strong>? Our AI generates unique questions each time based on your career path.
              </p>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
                <Link href="/mocktest" className="btn-primary" style={{ padding: "0.9rem 2rem" }}>
                  Start Full Test
                </Link>
                <button onClick={generateSample} className="btn-ghost" style={{ padding: "0.9rem 2rem" }}>
                  {generatingSample ? "Generating..." : "Get Sample Question"}
                </button>
              </div>

              {sampleQuestion && (
                <div className="glass-card fade-in" style={{ padding: "1.5rem", maxWidth: "600px", margin: "0 auto 2.5rem", border: "1px solid var(--primary-dim)" }}>
                  <p style={{ color: "var(--primary)", fontSize: "0.75rem", marginBottom: "0.5rem", fontWeight: 700 }}>Sample AI Question</p>
                  <p style={{ color: "white", fontSize: "1.1rem", lineHeight: 1.5 }}>"{sampleQuestion}"</p>
                  <Link href="/mocktest" style={{ color: "var(--secondary)", fontSize: "0.8rem", marginTop: "1rem", display: "inline-block", textDecoration: "none" }}>
                    Want to answer this? Start the test
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {showWhiteboard && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <div className="glass-panel fade-up" style={{ width: "100%", maxWidth: "900px", height: "80vh", display: "flex", flexDirection: "column", padding: "1.5rem", border: "1px solid var(--primary)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ color: "white", fontWeight: 700 }}>AI Whiteboard and Sketchpad</h3>
                <button onClick={() => setShowWhiteboard(false)} className="btn-danger" style={{ padding: "0.5rem 1rem", background: "red", color: "white", border: "none", borderRadius: "8px" }}>Close</button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Start typing your notes, code snippets, or architecture ideas here."
                style={{
                  flex: 1,
                  width: "100%",
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  color: "white",
                  fontSize: "1.1rem",
                  fontFamily: "monospace",
                  resize: "none",
                  outline: "none",
                }}
              />
              <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                <button 
                  className="btn-primary" 
                  style={{ flex: 1, padding: "1rem" }}
                  onClick={() => {
                    alert("Notes saved successfully to your student notebook!");
                    setShowWhiteboard(false);
                  }}
                >
                  Save Notes
                </button>
                <button
                  className="btn-ghost"
                  style={{ padding: "1rem" }}
                  onClick={() => setNotes("")}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="ai-loader"><div className="dot" /><div className="dot" /><div className="dot" /></div>
        </div>
      }
    >
      <RoadmapContent />
    </Suspense>
  );
}
