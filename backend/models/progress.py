from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from backend.database.connection import Base
class UserProgress(Base):  # <--- Note the name "UserProgress"
    __tablename__ = "user_progress"
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    category = Column(String) 
    completion_percentage = Column(Float, default=0.0)
    
    user = relationship("User", back_populates="progress")