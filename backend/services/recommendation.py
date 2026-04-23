import os
from dotenv import load_dotenv

try:
    from google import genai
except ImportError:
    genai = None

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if genai and api_key else None

def get_recommendation(career: str, skills: str):
    prompt = f"""
    You are a Strategic Career Architect.
    Generate a comprehensive 5-Phase professional roadmap for a user who wants to be a '{career}'.
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
                "description": "A detailed paragraph explaining the core concepts and why they matter for this career.",
                "tasks": ["Task 1", "Task 2"]
            }},
            ...
        ]
    }}
    Ensure exactly 5 sequential phases from beginner to expert.
    """

    try:
        import json
        if not client or not api_key or "AIza" not in api_key:
            raise ValueError("No API Key configured")

        response = client.models.generate_content(
            model="gemini-3-flash-preview",
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
                    "description": "Establish a strong understanding of syntax, loops, and basic data structures that form the backbone of modern engineering.",
                    "tasks": ["Study core syntax", "Build basic CLI projects"]
                },
                {
                    "name": "Phase 2: Intermediate Implementation",
                    "goal": "Apply knowledge to real-world applications.",
                    "description": "Transition from theory to practice by building functional applications that interact with data.",
                    "tasks": ["Integrate APIs", "Optimize application performance"]
                },
                {
                    "name": "Phase 3: Advanced Architecture",
                    "goal": "Master complex systems.",
                    "description": "Focus on scalability, design patterns, and distributed systems.",
                    "tasks": ["Microservices", "Design scalable databases"]
                },
                {
                    "name": "Phase 4: Expert Specialization",
                    "goal": "Deep dive into industry standards.",
                    "description": "Perfect your craft by mastering scalable architectures, deployments, and security.",
                    "tasks": ["Architecture design", "Production deployment"]
                },
                {
                    "name": "Phase 5: Leadership & Mentoring",
                    "goal": "Lead teams and drive impact.",
                    "description": "Give back to the community, lead projects, and mentor junior colleagues.",
                    "tasks": ["Code reviews", "Technical leadership"]
                }
            ]
        }
