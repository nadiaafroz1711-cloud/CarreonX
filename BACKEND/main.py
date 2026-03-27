import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv # type: ignore

# 1. IMPORT YOUR DATABASE TOOLS
# This points to the database.py file inside your database folder
from database.database import engine, Base

# 2. LOAD ENVIRONMENT VARIABLES
# This allows main.py to read your .env file
load_dotenv()

app = FastAPI()

# 3. INITIALIZE DATABASE
# This creates all tables defined in your models automatically
Base.metadata.create_all(bind=engine)

# 4. CORS SETTINGS
# Crucial for letting your Flutter frontend talk to this FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    # You can verify if the env is loaded by checking a variable
    debug_mode = os.getenv("DEBUG", "False")
    return {
        "message": "CareerAI Backend is Running",
        "debug_mode": debug_mode
    }

if __name__ == "__main__":
    import uvicorn
    # Use the PORT from .env or default to 8000
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="127.0.0.1", port=port, reload=True)