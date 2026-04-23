import os
import pandas as pd
from sqlalchemy.orm import Session
from dotenv import load_dotenv

try:
    from google import genai
except ImportError:
    genai = None

# Load .env from backend directory
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

# Import models
from backend.models.user import User
from backend.models.profile import Profile
from backend.models.progress import UserProgress
from backend.models.chat_history import ChatHistory
from backend.models.scores import MockTestScore

# --- Gemini client setup ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL   = "gemini-flash-latest"   # confirmed working model

client = None
if genai and GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        print(f"[Chatbot] Gemini client init error: {e}")

# In-memory cache to save quota
CHAT_CACHE = {}


def _build_offline_answer(question: str, next_skill: str) -> str:
    """
    A question-aware offline fallback that at least acknowledges
    what the user asked instead of always saying the same thing.
    """
    q = question.strip().lower()

    if any(w in q for w in ["interview", "prepare", "prep"]):
        return (
            "For interview preparation, focus on these areas:\n\n"
            "1. **Data Structures & Algorithms** – LeetCode, HackerRank\n"
            "2. **System Design** – Design scalable systems (Grokking the System Design Interview)\n"
            "3. **Behavioral Questions** – Use the STAR method\n"
            "4. **Company Research** – Know the company's tech stack\n\n"
            "Great free resources:\n"
            "- https://www.youtube.com/results?search_query=software+engineering+interview+prep\n"
            "- https://www.geeksforgeeks.org/company-interview-corner/\n"
            "- https://leetcode.com/explore/"
        )
    elif any(w in q for w in ["roadmap", "path", "plan", "learn", "next", "start"]):
        yt  = f"https://www.youtube.com/results?search_query={next_skill.replace(' ', '+')}+tutorial"
        gfg = f"https://www.geeksforgeeks.org/search/?q={next_skill.replace(' ', '+')}"
        return (
            f"Based on your profile, the next skill to master is **{next_skill}**.\n\n"
            f"Here's your learning plan:\n"
            f"1. Watch beginner tutorials: {yt}\n"
            f"2. Practice with examples: {gfg}\n"
            f"3. Build a small project using {next_skill} to solidify your knowledge.\n\n"
            f"Stay consistent — even 1 hour a day compounds into mastery!"
        )
    elif any(w in q for w in ["skill", "demand", "job", "career", "industry"]):
        return (
            "The most in-demand skills right now:\n\n"
            "🔥 **Tech**: Python, TypeScript, Cloud (AWS/Azure/GCP), DevOps, AI/ML\n"
            "🔥 **Web**: React, Next.js, Node.js, REST APIs\n"
            "🔥 **Data**: SQL, Pandas, TensorFlow, LLMs\n"
            "🔥 **Security**: Ethical Hacking, SOC Analysis, Cloud Security\n\n"
            "Focus on depth in 2–3 skills rather than breadth across many."
        )
    elif any(w in q for w in ["python", "javascript", "react", "node", "sql", "ml", "ai", "java", "c++", "css", "html"]):
        lang = next((w for w in ["python","javascript","react","node","sql","ml","ai","java","css","html"] if w in q), "programming")
        yt  = f"https://www.youtube.com/results?search_query={lang}+full+course"
        w3  = f"https://www.google.com/search?q=site:w3schools.com+{lang}"
        gfg = f"https://www.geeksforgeeks.org/search/?q={lang}"
        return (
            f"Great question about **{lang.title()}**! Here are the best free resources:\n\n"
            f"- 🎬 YouTube Course: {yt}\n"
            f"- 📖 W3Schools Reference: {w3}\n"
            f"- 💡 GeeksforGeeks: {gfg}\n\n"
            f"Tip: Build a real project as you learn — it's the fastest way to retain knowledge."
        )
    elif any(w in q for w in ["salary", "pay", "earn", "money", "compensation"]):
        return (
            "Salary ranges (India, approximate):\n\n"
            "- Junior Dev (0–2 yrs): ₹3–8 LPA\n"
            "- Mid-Level Dev (2–5 yrs): ₹8–20 LPA\n"
            "- Senior Dev (5+ yrs): ₹20–50 LPA\n"
            "- Data Scientist: ₹8–25 LPA\n"
            "- Cloud/DevOps Engineer: ₹10–30 LPA\n\n"
            "Key factors: skills, company size, location, and your portfolio quality."
        )
    else:
        # Generic but still references the question text
        return (
            f"You asked: *\"{question}\"*\n\n"
            f"I'm temporarily unable to reach the AI engine. However, here's my advice:\n\n"
            f"Based on your career path, focus on mastering **{next_skill}** step-by-step. "
            f"Break your goal into daily practice sessions and build projects to showcase your skills.\n\n"
            f"For learning resources: https://www.youtube.com/results?search_query={next_skill.replace(' ', '+')}+tutorial\n\n"
            f"Try asking again in a moment — the AI mentor will give you a personalised answer!"
        )


def get_chatbot_response(user_id: int, question: str, db: Session) -> str:
    # Check cache first
    cache_key = f"{user_id}:{question.strip().lower()}"
    if cache_key in CHAT_CACHE:
        return CHAT_CACHE[cache_key]

    # 1. Fetch user context from DB
    user         = db.query(User).filter(User.id == user_id).first()
    profile_data = db.query(Profile).filter(Profile.user_id == user_id).first()
    progress     = db.query(UserProgress).filter(UserProgress.user_id == user_id).all()
    scores       = db.query(MockTestScore).filter(MockTestScore.user_id == user_id).order_by(MockTestScore.created_at.desc()).all()

    career_goal      = (profile_data.domain if profile_data else None) or "Career Growth"
    skills_known     = (profile_data.skills if profile_data else "") or ""
    completed_skills = [p.title for p in progress] if progress else []
    latest_score     = f"{scores[0].percentage:.0f}%" if scores else "Not taken yet"
    username         = user.username if user else "Learner"

    # 2. Determine next recommended skill from CSV
    next_skill = "Python" if "data" in career_goal.lower() else "JavaScript"
    csv_path   = os.path.join(os.path.dirname(os.path.dirname(__file__)), "datasets", "roadmap.csv")
    if os.path.exists(csv_path):
        try:
            df = pd.read_csv(csv_path)
            remaining = df[~df["skill"].str.lower().isin([s.lower() for s in completed_skills])]
            if not remaining.empty:
                next_skill = remaining.iloc[0]["skill"]
        except Exception as e:
            print(f"[Chatbot] CSV error: {e}")

    # 3. Fetch recent chat history (last 5 turns)
    recent = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == user_id)
        .order_by(ChatHistory.created_at.desc())
        .limit(5)
        .all()
    )
    history_text = ""
    if recent:
        for h in reversed(recent):
            history_text += f"User: {h.question}\nMentor: {h.answer}\n\n"

    # 4. Build the prompt — question is front and center
    prompt = f"""You are CarreonX Mentor, an elite, friendly AI career advisor.

User Profile:
- Name: {username}
- Career Goal: {career_goal}
- Skills They Know: {skills_known or 'Not specified'}
- Completed Roadmap Steps: {', '.join(completed_skills) if completed_skills else 'None yet'}
- Latest Mock Test Score: {latest_score}
- Recommended Next Step: {next_skill}

Recent Conversation (last 5 turns):
{history_text.strip() if history_text else 'No prior history.'}

---
USER'S CURRENT QUESTION: {question}
---

Instructions:
- Answer the USER'S CURRENT QUESTION directly and specifically. Do NOT ignore the question.
- Be concise, encouraging, and professional.
- Use markdown (bold, bullet points) for clarity.
- If the question is about a specific technology, skill, or concept — explain it.
- If you recommend resources, use real, working URLs.
- Do NOT always pivot to {next_skill} unless it's relevant to the question.
- Keep your response under 250 words.
"""

    # 5. Call Gemini
    answer = ""
    try:
        if not client:
            raise ValueError("Gemini client not initialized — check GEMINI_API_KEY")

        try:
            # Primary choice
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt
            )
            answer = response.text.strip()
        except Exception as e:
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                print(f"[Chatbot] Model {GEMINI_MODEL} exhausted, trying gemini-1.5-flash...")
                # Automatic fallback to older stable model
                response = client.models.generate_content(
                    model="gemini-1.5-flash",
                    contents=prompt
                )
                answer = response.text.strip()
            else:
                raise e

    except Exception as e:
        print(f"[Chatbot] Gemini error: {e}")
        answer = _build_offline_answer(question, next_skill)

    # 6. Save to chat history and cache
    try:
        CHAT_CACHE[cache_key] = answer
        db.add(ChatHistory(user_id=user_id, question=question, answer=answer))
        db.commit()
    except Exception as e:
        print(f"[Chatbot] History save error: {e}")
        db.rollback()

    return answer
