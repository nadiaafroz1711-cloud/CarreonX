from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
# Ensure this import matches your project structure exactly
from backend.database import Base 

# IMPORTANT: If Profile is in another file, import it like this:
# from .other_file import Profile as UserProfile

class User(Base):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True} 
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    # ✅ Relationships fixed
    progress = relationship("UserProgress", back_populates="user")
    scores = relationship("MockTestScore", back_populates="user")
    
    # ✅ Using the direct class reference to avoid naming conflicts
    # Note: Make sure 'UserProfile' is imported or defined before this line
    profile = relationship("Profile", back_populates="user", uselist=False)

class UserProgress(Base):
    __tablename__ = "user_progress"
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    item_id = Column(String)    
    item_type = Column(String)  
    is_completed = Column(Boolean, default=True)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="progress")

class MockTestScore(Base):
    __tablename__ = "test_scores"
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject = Column(String)    
    score = Column(Integer)
    total_questions = Column(Integer)
    percentage = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="scores")