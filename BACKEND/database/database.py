import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv # type: ignore

# 1. TELL PYTHON TO READ THE .ENV FILE
# This looks for the .env file in the same folder and loads its variables
load_dotenv()

# 2. EXTRACT THE VARIABLE
# We use os.getenv to grab the specific string we named in the .env file
DATABASE_URL = os.getenv("DATABASE_URL")

# 3. USE THE VARIABLE TO START THE ENGINE
if not DATABASE_URL:
    raise ValueError("No DATABASE_URL found in environment variables!")

engine = create_engine(DATABASE_URL)

# Standard SQLAlchemy Setup
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()