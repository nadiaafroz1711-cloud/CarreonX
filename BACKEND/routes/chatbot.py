from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.services.chatbot_services import get_chatbot_response

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

@router.post("/ask")
def ask_chatbot(user_id: int, question: str, db: Session = Depends(get_db)):
    answer = get_chatbot_response(user_id, question, db)
    return {"answer": answer}