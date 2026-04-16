# CarreonX: Viva Preparation Guide
## Top 30 Questions and Answers

### A. Basic Questions (Commonly Asked)

**1. What is CarreonX?**
- **A**: CarreonX is an AI-powered career intelligence platform that helps students and graduates bridge the gap between their current skills and their professional goals via personalised roadmaps, AI mentorship, and mock testing.

**2. Why did you choose this project?**
- **A**: I noticed that many students faces "analysis paralysis" when choosing a career path or identifying necessary skills. Traditional counseling is inaccessible to many; CarreonX democratizes this guidance using Generative AI.

**3. What are the core modules of your project?**
- **A**: Authentication, Profile Onboarding, AI Roadmap Generator, AI Mentor Chatbot, Mock Test System, and Progress Analytics.

---

### B. Technical Questions (Backend & Logic)

**4. Why did you use FastAPI over Django or Flask?**
- **A**: FastAPI is significantly faster and supports asynchronous programming (`async/await`) out of the box, which is essential for handling multiple AI API requests simultaneously without blocking.

**5. How is your database structured?**
- **A**: We use a relational model with tables for Users, Profiles (storing domains/skills), and Results (storing mock test scores and progress).

**6. What is SQLAlchemy and why did you use it?**
- **A**: It is an Object Relational Mapper (ORM) that allows us to interact with the database using Python objects instead of writing raw SQL, making the code cleaner and more maintainable.

**7. How do you handle User Authentication?**
- **A**: We use a custom authentication flow where passwords are not stored in plain text (for security) and sessions are managed via the frontend (`localStorage`).

**8. Explain the "Skill Gap Analysis" logic.**
- **A**: The user provides their "Target Career" and "Current Skills." These are sent to the AI API, which compares them against industry standards to identify missing competencies.

---

### C. AI Questions (Gemini & LLMs)

**9. Which AI model are you using?**
- **A**: I am using Google Gemini Pro 1.5, which is a state-of-the-art Large Language Model (LLM) capable of complex reasoning and structured output.

**10. How does the AI Chatbot "know" about the user's profile?**
- **A**: Each request to the chatbot includes a "System Prompt" containing the user's target career and skills, giving it the necessary context to provide personalised advice.

**11. Is your AI "Rule-based" or "Generative"?**
- **A**: It is **Generative**. Unlike rule-based systems that use simple `if-else` logic, CarreonX can handle an infinite variety of career combinations and provide human-like explanations.

**12. How do you prevent AI Hallucinations?**
- **A**: We use specific "Prompt Engineering" techniques to constrain the AI's output to structured formats and verifiable career data.

---

### D. Frontend & UX Questions

**13. What is Next.js and why did you use it?**
- **A**: Next.js is a React framework that offers superior performance, SEO optimization, and a better developer experience through its file-based routing and App Router system.

**14. What is "Glassmorphism" in your UI?**
- **A**: It is a modern design aesthetic characterized by frosted-glass effects, vibrant gradients, and transparency, which gives the UI a premium, state-of-the-art feel.

**15. Is your UI responsive?**
- **A**: Yes, the layout uses CSS Flexbox and Grid, along with media queries, to ensure it works seamlessly on tablets, laptops, and desktops.

---

### E. Advanced & Result-based Questions

**16. How did you verify your system's performance?**
- **A**: We ran production `npm run build` benchmarks and verified that AI responses are generated in under 2 seconds.

**17. What is the "Future Scope" of this project?**
- **A**: Real-time resume parsing (PDF analysis), direct job matching, and a dedicated mobile application (Flutter).

**18. What was the biggest challenge you faced?**
- **A**: Integrating several moving parts (AI, Database, and Frontend) into a single synchronous flow while maintaining a fast, premium user experience.
