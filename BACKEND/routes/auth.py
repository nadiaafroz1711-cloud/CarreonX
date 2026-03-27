from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import SessionLocal
from models.user import User, Profile  # Import both models
from schemas.user_schema import UserCreate, UserResponse
from schemas.profile_schema import ProfileResponse

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1. POST: Register a new User
@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = User(
        name=user.name, 
        email=user.email, 
        hashed_password=user.password  # In a real app, hash this!
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# 2. GET: List all Users (This is the blue bar you saw)
@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

# 3. GET: Fetch a specific User's Profile
@router.get("/profile/{user_id}", response_model=ProfileResponse)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile