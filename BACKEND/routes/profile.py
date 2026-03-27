from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import SessionLocal
from models.user import Profile, User
from schemas.profile_schema import ProfileCreate, ProfileResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ProfileResponse)
def create_profile(profile_data: ProfileCreate, user_id: int, db: Session = Depends(get_db)):
    # Create the profile and link it to a user
    new_profile = Profile(**profile_data.model_dump(), user_id=user_id)
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile