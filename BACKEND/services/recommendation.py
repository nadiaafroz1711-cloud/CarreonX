import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

def get_recommendation(career: str, skills: str):
    prompt = f"""
    You are a Strategic Career Architect.
    Generate a 3-Phase professional roadmap for a user who wants to be a '{career}'.
    Current Skills: '{skills}'.

    Format the response strictly as a JSON object with the following structure:
    {{
        "title": "Mastery in {career}",
        "summary": "Short overview of the journey.",
        "recommended_skills": ["Skill 1", "Skill 2", "Skill 3"],
        "interview_tips": ["Tip 1", "Tip 2"],
        "phases": [
            {{
                "name": "Phase 1: Foundations",
                "goal": "What will be achieved",
                "tasks": ["Task 1", "Task 2"]
            }},
            ...
        ]
    }}
    Ensure exactly 3 phases.
    """

    try:
        import json
        if not api_key or "AIza" not in api_key:
            raise ValueError("No API Key configured")

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        # Strip potential markdown code blocks
        clean_json = response.text.strip().replace("```json", "").replace("```", "").strip()
        return json.loads(clean_json)
    except Exception as e:
        print(f"Recommendation Error: {e}")
        # Fallback structured roadmap
        return {
            "title": f"Path to {career}",
            "summary": "Analyzing your path... (AI currently limited)",
            "recommended_skills": ["Algorithms", "System Design", "Cloud Basics"],
            "interview_tips": [
                "Practice coding on a whiteboard.",
                "Review core design patterns."
            ],
            "phases": [
                {
                    "name": "Phase 1: Foundations",
                    "goal": "Master the core programming and logic concepts.",
                    "tasks": ["Study core syntax", "Build basic CLI projects"]
                },
                {
                    "name": "Phase 2: Intermediate Implementation",
                    "goal": "Apply knowledge to real-world applications.",
                    "tasks": ["Integrate APIs", "Optimize application performance"]
                },
                {
                    "name": "Phase 3: Expert Specialization",
                    "goal": "Deep dive into advanced topics and industry standards.",
                    "tasks": ["Architecture design", "Production deployment"]
                }
            ]
        }