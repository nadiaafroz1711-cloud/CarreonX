from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database.connection import Base

class MockTest(Base):
    __tablename__ = 'mock_test'
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    subject = Column(String(200), nullable=False)
    score = Column(Integer)
    total_questions = Column(Integer)
    percentage = Column(Float)
    user_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="mock_tests")