import os
import json
from fastapi import APIRouter, Query
from dotenv import load_dotenv

try:
    from google import genai
except ImportError:
    genai = None

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

router = APIRouter(prefix="/interview", tags=["Interview Prep"])

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if genai and api_key else None

@router.get("/")
async def get_interview_prep(career: str = Query(..., description="The target career"), skills: str = Query("", description="User's current skills")):
    prompt = f"""
    You are an Expert Technical Recruiter for Fortune 500 companies.
    Generate a set of interview preparation materials for a candidate applying for a '{career}' role.
    Candidate's current skills: {skills}.

    Format the response strictly as a JSON object with:
    1. "behavioral_questions": A list of 3 behavioral questions.
    2. "technical_questions": A list of 5 technical questions specific to {career}.
    3. "expert_tips": A list of 3 tips on how to ace this specific interview.
    4. "mock_scenario": A short paragraph describing a realistic technical interview scenario.
    
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
        prep_data = json.loads(clean_json)
        return prep_data
    except Exception as e:
        print(f"Interview Prep Gen Error: {e}")
        # Fallback prep data
        return {
            "behavioral_questions": [
                "Tell me about a time you solved a complex problem.",
                "How do you handle conflict in a team?",
                "Why do you want to be a " + career + "?"
            ],
            "technical_questions": [
                "Explain the core concepts of " + career + ".",
                "What tools do you use for development?",
                "How do you ensure code quality?",
                "Describe a project you worked on recently.",
                "What is your approach to learning new technologies?"
            ],
            "expert_tips": [
                "Research the company's culture.",
                "Be ready to explain your projects in detail.",
                "Practice your coding skills daily."
            ],
            "mock_scenario": "The interviewer asks you to design a scalable system for a high-traffic application."
        }