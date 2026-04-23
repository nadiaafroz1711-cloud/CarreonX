from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models.progress import UserProgress
from backend.models.scores import MockTestScore

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/{user_id}")
def get_dashboard(user_id: int, db: Session = Depends(get_db)):
    progress_items = db.query(UserProgress).filter(UserProgress.user_id == user_id).all()
    latest_score = db.query(MockTestScore).filter(
        MockTestScore.user_id == user_id
    ).order_by(MockTestScore.created_at.desc()).first()

    return {
        "user_id": user_id,
        "progress_count": len(progress_items),
        "latest_test_score": latest_score.percentage if latest_score else 0,
        "status": "Active"
    }