from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import engine, Base  # Matches your folder structure
from routes import roadmap  # Assuming you have a roadmap route in your routes folder

app = FastAPI()

# 1. DATABASE INITIALIZATION
# This creates the tables in your database automatically when the app starts
Base.metadata.create_all(bind=engine)

# 2. CORS SETTINGS
# This allows your Flutter app (Frontend) to talk to this Python API (Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. ROUTES
@app.get("/")
def read_root():
    return {"message": "Welcome to CareerAI API"}

# Include your roadmap routes here
# app.include_router(roadmap.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)