from fastapi import FastAPI
import os
import sys

# Ensure the root directory is in the python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.database.connection import engine, Base

# Import models to ensure they are registered with Base
from backend.models.user import User
from backend.models.profile import Profile
from backend.models.Mock_test import MockTest
from backend.models.scores import MockTestScore
from backend.models.progress import UserProgress
from backend.models.chat_history import ChatHistory

# Initialize mappers
from sqlalchemy.orm import configure_mappers
configure_mappers()

# Create tables
Base.metadata.create_all(bind=engine)

from backend.routes import (
    auth,
    profiles,
    recommendation,
    chatbot,
    progress,
    analytics,
    courses,
    dashboard,
    interview,
    learning,
    Mocktest,
    projects,
    tracker,
    youtube
)

# 4. Initialize FastAPI app
app = FastAPI(
    title="CarreonX API",
    description="AI Career Guidance System",
    version="1.0.0"
)

# 5. CORS Middleware — must be added BEFORE routers so preflight OPTIONS are handled
from fastapi.middleware.cors import CORSMiddleware

allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_raw.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 6. Root route
@app.get("/")
def home():
    return {
        "status": "online",
        "message": "CarreonX Backend Running Successfully 🚀",
        "docs": "/docs"
    }

# 7. Include routers
app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(recommendation.router)
app.include_router(progress.router)
app.include_router(chatbot.router)
app.include_router(analytics.router)
app.include_router(courses.router)
app.include_router(dashboard.router)
app.include_router(interview.router)
app.include_router(learning.router)
app.include_router(Mocktest.router)
app.include_router(projects.router)
app.include_router(tracker.router)
app.include_router(youtube.router)