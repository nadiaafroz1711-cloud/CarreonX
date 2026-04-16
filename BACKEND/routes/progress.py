from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models.progress import UserProgress

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.post("/update")
def update_progress(user_id: int, title: str, category: str, completion_percentage: float = 0.0, db: Session = Depends(get_db)):
    progress = UserProgress(
        user_id=user_id,
        title=title,
        category=category,
        completion_percentage=completion_percentage
    )
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return {"message": "Progress updated", "id": progress.id}

@router.get("/{user_id}")
def get_progress(user_id: int, db: Session = Depends(get_db)):
    items = db.query(UserProgress).filter(UserProgress.user_id == user_id).all()
    return {"user_id": user_id, "progress": [{"id": i.id, "title": i.title, "category": i.category, "completion_percentage": i.completion_percentage} for i in items]}