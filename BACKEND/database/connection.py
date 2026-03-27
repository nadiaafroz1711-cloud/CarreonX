import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv # type: ignore

# 1. Load the .env file
load_dotenv()

# 2. Get the URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

# 3. Create the Engine
# Note: If using SQLite, add: connect_args={"check_same_thread": False}
engine = create_engine(DATABASE_URL)

# 4. Create a Session factory
# This is what you'll use to create a new database session for each request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 5. Create the Base class
# Your models (User, Roadmap, etc.) must inherit from this
Base = declarative_base()

# 6. Dependency to get a DB session (used in your routes)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()