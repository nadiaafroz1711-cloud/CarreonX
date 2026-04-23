from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.database.connection import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    profiles = relationship("Profile", back_populates="user")
    progress = relationship("UserProgress", back_populates="user")
    test_scores = relationship("MockTestScore", back_populates="user")
    mock_tests = relationship("MockTest", back_populates="user")
