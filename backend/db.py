from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 🔑 Replace with your PostgreSQL password
DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/careerai_db"

# Engine
engine = create_engine(DATABASE_URL)

# Session
SessionLocal = sessionmaker(bind=engine)

# Base class
Base = declarative_base()