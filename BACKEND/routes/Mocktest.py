import os
import json
from google import genai
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from backend.database.connection import get_db
from backend.models.scores import MockTestScore
from pydantic import BaseModel

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

router = APIRouter(prefix="/mocktest", tags=["Mock Test"])

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

class TestSubmission(BaseModel):
    user_id: int
    subject: str
    score: int
    total_questions: int

@router.get("/generate")
async def generate_mock_test(subject: str = Query(..., description="The topic for the test")):
    prompt = f"""
    Generate 5 multiple-choice questions for a mock test on the subject: {subject}.
    Format the response as a JSON array of objects, each with:
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "The correct option text exactly as in options list"
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        clean_json = response.text.strip().replace("```json", "").replace("```", "").strip()
        questions = json.loads(clean_json)
        return {"subject": subject, "questions": questions}
    except Exception as e:
        print(f"Mock Test Gen Error: {e}")
        # Fallback questions
        return {
            "subject": subject,
            "questions": [
                {
                    "question": f"What is a core concept of {subject}?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "answer": "Option A"
                }
            ]
        }

@router.post("/submit")
async def submit_test_score(data: TestSubmission, db: Session = Depends(get_db)):
    calc_percentage = round((data.score / data.total_questions) * 100, 2)
    try:
        new_test = MockTestScore(
            user_id=data.user_id,
            subject=data.subject,
            score=data.score,
            total_questions=data.total_questions,
            percentage=calc_percentage
        )
        db.add(new_test)
        db.commit()
        db.refresh(new_test)
        return {"status": "success", "score_id": new_test.id, "percentage": calc_percentage}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")