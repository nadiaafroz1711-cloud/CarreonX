import os
import pandas as pd
from google import genai
from sqlalchemy.orm import Session
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

# Import models
from backend.models.user import User
from backend.models.progress import UserProgress
from backend.models.chat_history import ChatHistory
from backend.models.scores import MockTestScore

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

def get_chatbot_response(user_id: int, question: str, db: Session):
    # 1. READ USER DATA & PROGRESS FROM DB
    user = db.query(User).filter(User.id == user_id).first()
    progress = db.query(UserProgress).filter(UserProgress.user_id == user_id).all()
    scores = db.query(MockTestScore).filter(MockTestScore.user_id == user_id).all()

    # Process data for context
    completed_skills = [p.title for p in progress] if progress else []
    latest_score = scores[-1].score if scores else "N/A"
    career_goal = user.email if user else "Professional Growth" # Fallback if user profile is thin

    # Fetch recent chat history (last 5 interactions)
    recent_history = db.query(ChatHistory).filter(ChatHistory.user_id == user_id).order_by(ChatHistory.timestamp.desc()).limit(5).all()
    history_context = ""
    if recent_history:
        recent_history.reverse() # Chronological order
        for item in recent_history:
            history_context += f"User: {item.question}\nMentor: {item.answer}\n\n"

    # 2. READ ROADMAP CSV & SUGGEST NEXT SKILL
    next_skill = "Explore advanced topics in your field"
    resource_link = "https://google.com"
    
    csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "datasets", "roadmap.csv")
    if os.path.exists(csv_path):
        try:
            df = pd.read_csv(csv_path)
            # Find skills for the user's likely career (or just next in line)
            # Simple logic: first skill in CSV not in completed_skills
            remaining = df[~df['skill'].str.lower().isin([s.lower() for s in completed_skills])]
            if not remaining.empty:
                next_skill = remaining.iloc[0]['skill']
                resource_link = remaining.iloc[0]['resource']
        except Exception as e:
            print(f"CSV Error: {e}")

    prompt = f"""
    You are CarreonX Mentor, an elite AI career advisor.
    
    User Profile Context:
    - Career Goal: {career_goal}
    - Completed Skills: {', '.join(completed_skills) if completed_skills else 'None yet'}
    - Latest Mock Test Score: {latest_score}
    - Recommended Next Step: {next_skill}

    Recent Conversation History:
    {history_context if history_context else 'No previous history.'}

    Current User Question: {question}

    Provide a concise, professional, and encouraging response based on their profile and our conversation history. 
    If they ask what to do next, mention {next_skill} and provide this resource: {resource_link}.
    """

    answer = ""
    try:
        # 4. GENERATE AI RESPONSE
        if not api_key or "AIza" not in api_key:
            raise ValueError("Invalid API Key")

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        answer = response.text
    except Exception as e:
        # 5. FALLBACK LOGIC
        print(f"Chatbot AI Error: {e}")
        answer = f"I'm currently in offline mode, but based on your progress, you've completed {len(completed_skills)} skills. Your next goal should be mastering **{next_skill}**. You can start here: {resource_link}. How else can I help you manually?"

    # 6. SAVE CHAT HISTORY
    try:
        chat_entry = ChatHistory(
            user_id=user_id,
            question=question,
            answer=answer
        )
        db.add(chat_entry)
        db.commit()
    except Exception as e:
        print(f"History Save Error: {e}")

    return answer