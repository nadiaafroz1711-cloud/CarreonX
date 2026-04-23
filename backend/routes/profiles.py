from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models.profile import Profile
from backend.schemas import profile_schema as schemas

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("/{user_id}", response_model=schemas.ProfileResponse)
def get_profile(user_id: int, db: Session = Depends(get_db)):
    db_profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Convert skills string back to list for the response model if needed
    # (FastAPI/Pydantic might handle it if we use a validator, 
    # but let's just make it work with the schema)
    return {
        "id": db_profile.id,
        "user_id": db_profile.user_id,
        "domain": db_profile.domain,
        "skills": db_profile.skills.split(", ") if db_profile.skills else []
    }

@router.post("/create", response_model=schemas.ProfileResponse)
def create_profile(profile: schemas.ProfileCreate, db: Session = Depends(get_db)):
    # Check if profile already exists for this user
    db_profile = db.query(Profile).filter(Profile.user_id == profile.user_id).first()
    if db_profile:
        # Update instead of error? Let's stick to update for better DX
        db_profile.domain = profile.domain
        db_profile.skills = ", ".join(profile.skills)
        db.commit()
        db.refresh(db_profile)
    else:
        db_profile = Profile(
            user_id=profile.user_id,
            domain=profile.domain,
            skills=", ".join(profile.skills)
        )
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
    
    return {
        "id": db_profile.id,
        "user_id": db_profile.user_id,
        "domain": db_profile.domain,
        "skills": db_profile.skills.split(", ") if db_profile.skills else []
    }