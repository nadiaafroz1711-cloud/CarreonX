from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models.progress import UserProgress
from pydantic import BaseModel

router = APIRouter(prefix="/tracker", tags=["Learning Tracker"])

# Schema for the request body
class ProgressUpdate(BaseModel):
    user_id: int
    item_id: str    # e.g., "Python 101" or "Skill_01"
    item_type: str  # "course", "skill", or "project"

@router.post("/complete")
async def mark_item_complete(data: ProgressUpdate, db: Session = Depends(get_db)):
    # 1. Check if it's already marked as complete
    existing = db.query(UserProgress).filter(
        UserProgress.user_id == data.user_id,
        UserProgress.title == data.item_id
    ).first()

    if existing:
        return {"message": "Item already completed", "status": "exists"}

    # 2. Add new completion record
    new_progress = UserProgress(
        user_id=data.user_id,
        title=data.item_id,
        category=data.item_type,
        completion_percentage=100.0
    )
    
    db.add(new_progress)
    db.commit()
    db.refresh(new_progress)
    
    return {"message": "Progress saved successfully", "id": new_progress.id}

@router.get("/user/{user_id}")
async def get_user_completed_items(user_id: int, db: Session = Depends(get_db)):
    items = db.query(UserProgress).filter(UserProgress.user_id == user_id).all()
    return {"user_id": user_id, "completed_items": [{"id": i.id, "title": i.title, "category": i.category, "completion_percentage": i.completion_percentage} for i in items]}