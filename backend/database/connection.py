import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

# 1. READ DB URL FROM ENV (FOR PRODUCTION)
# Render/Heroku provide "postgres://", but SQLAlchemy 1.4+ needs "postgresql://"
from pathlib import Path
def find_project_root():
    current = Path(__file__).resolve()
    # Search upwards for the CarreonX_PROJECT directory
    for parent in [current] + list(current.parents):
        if parent.name == "CarreonX_PROJECT":
            return parent
    # Fallback if not found in parent tree
    return current.parent.parent.parent

PROJECT_ROOT = find_project_root()
db_path = PROJECT_ROOT / "sql_app.db"
raw_db_url = os.getenv("DATABASE_URL", f"sqlite:///{db_path.as_posix()}")

if raw_db_url.startswith("postgres://"):
    raw_db_url = raw_db_url.replace("postgres://", "postgresql://", 1)

SQLALCHEMY_DATABASE_URL = raw_db_url

# 2. CREATE ENGINE
# For SQLite, we need connect_args; for Postgres, we don't.
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)



SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This is the ONLY Base that should exist in your project
Base = declarative_base()

# --- MODELS ---


# 3. DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()