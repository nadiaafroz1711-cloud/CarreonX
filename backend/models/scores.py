from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
# Import Base from connection
from backend.database.connection import Base

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
    
    # Use string reference to avoid circular imports
    user = relationship("User", back_populates="test_scores")