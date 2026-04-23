import os
import json
from fastapi import APIRouter, Query
from dotenv import load_dotenv

try:
    from google import genai
except ImportError:
    genai = None

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

router = APIRouter(prefix="/jobs", tags=["Jobs"])

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if genai and api_key else None

@router.get("/")
async def get_job_recommendations(career: str = Query(..., description="The target career"), skills: str = Query("", description="User's current skills")):
    prompt = f"""
    You are an Expert Technical Recruiter and Career Advisor.
    Find realistic job market opportunities for a candidate looking for a '{career}' role.
    Their current skills include: {skills}.

    Format the response strictly as a JSON object with:
    1. "job_roles": A list of 3 specific job titles they should apply for (e.g., "Junior React Developer").
    2. "mock_listings": A list of 3 mock job descriptions. Each should be an object with:
        - "title": Job title
        - "company": A fictional tech company name
        - "salary_range": E.g., "$70,000 - $90,000"
        - "match_percentage": A number between 70 and 99 representing how well they match based on their skills
        - "description": A short 2-sentence description of the role.
    3. "advice": A short paragraph of advice on where they should look for these jobs and how to stand out.
    
    Ensure the JSON is clean and contains no markdown formatting.
    """
    
    try:
        if not client or not api_key:
            raise ValueError("Gemini client unavailable")

        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt
        )

        clean_json = response.text.strip().replace("```json", "").replace("```", "").strip()
        job_data = json.loads(clean_json)
        return job_data
    except Exception as e:
        print(f"Jobs Gen Error: {e}")
        # Fallback offline data
        return {
            "job_roles": [f"Junior {career}", f"{career} Associate", "Entry-level Developer"],
            "mock_listings": [
                {
                    "title": f"Junior {career}",
                    "company": "TechNova Solutions",
                    "salary_range": "₹6,000,000 - ₹8,000,000",
                    "match_percentage": 85,
                    "description": f"Looking for a motivated individual to join our {career} team. You will work on exciting new projects and learn from seniors."
                },
                {
                    "title": f"{career} Specialist",
                    "company": "CloudSync Inc.",
                    "salary_range": "₹8,000,000 - ₹12,000,000",
                    "match_percentage": 75,
                    "description": "We need a specialist who can hit the ground running. Great benefits and remote work options."
                },
                {
                    "title": f"Associate {career}",
                    "company": "DataFlow Analytics",
                    "salary_range": "₹5,000,000 - ₹7,000,000",
                    "match_percentage": 92,
                    "description": "Perfect entry-level role for a recent grad or bootcamp finisher. Mentorship provided."
                }
            ],
            "advice": "Focus on building a strong portfolio. Apply on LinkedIn, Indeed, and specialized tech job boards like Wellfound (AngelList)."
        }
