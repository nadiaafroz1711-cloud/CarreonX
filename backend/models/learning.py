from sqlalchemy import Column, Integer, String
from backend.database.connection import Base

class Learning(Base):
    __tablename__ = "learning"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    course = Column(String)
    status = Column(String)