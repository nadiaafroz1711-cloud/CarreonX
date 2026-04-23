from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Database Location
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

# 2. Create Engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. Create Session Factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Create the Base
# This is the "Parent" for all your tables. 
# REMOVE any lines like 'from backend.database.db import Base' inside this file.
Base = declarative_base()