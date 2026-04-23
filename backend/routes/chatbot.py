from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.services.chatbot_services import get_chatbot_response, client, GEMINI_MODEL

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


@router.post("/ask")
def ask_chatbot(user_id: int, question: str, db: Session = Depends(get_db)):
    if not question or not question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    try:
        answer = get_chatbot_response(user_id, question.strip(), db)
        return {"answer": answer, "model": GEMINI_MODEL if client else "offline"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chatbot error: {str(e)}")


@router.get("/status")
def chatbot_status():
    """Check if Gemini AI is available."""
    if client:
        return {"status": "online", "model": GEMINI_MODEL}
    return {"status": "offline", "model": None}