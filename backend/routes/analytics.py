import pandas as pd
import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.connection import get_db 
# Note: Check if your file is 'database.py' or 'connection.py' 
# Based on your main.py, it looks like: backend.database.connection
from backend.models.progress import UserProgress
from backend.models.scores import MockTestScore

router = APIRouter(prefix="/analytics", tags=["Dashboard Analytics"])

# Dynamically resolve path relative to this file (avoids hardcoded absolute paths)
CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "backend", "datasets", "roadmap.csv")

@router.get("/dashboard/{user_id}")
async def get_dashboard_data(user_id: int, db: Session = Depends(get_db)):
    # 1. Load the Roadmap (Total items to learn)
    try:
        df = pd.read_csv(CSV_PATH)
        total_roadmap_items = len(df)
    except Exception:
        total_roadmap_items = 0

    # 2. Get Completed Items from Database
    completed_items = db.query(UserProgress).filter(
        UserProgress.user_id == user_id,
    ).all()
    
    count_completed = len(completed_items)

    # 3. Calculate Progress Percentage
    progress_percent = 0
    if total_roadmap_items > 0:
        progress_percent = round((count_completed / total_roadmap_items) * 100, 2)

    # 4. Get Mock Test Scores (for the "Mock Test Score" card)
    latest_score = db.query(MockTestScore).filter(
        MockTestScore.user_id == user_id
    ).order_by(MockTestScore.created_at.desc()).first()

    return {
        "user_id": user_id,
        "progress_stats": {
            "completed_count": count_completed,
            "total_count": total_roadmap_items,
            "progress_percentage": progress_percent
        },
        "latest_test_score": latest_score.percentage if latest_score else 0,
        "status": "Learning" if progress_percent < 100 else "Career Ready"
    }