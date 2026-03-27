from fastapi import FastAPI

from database.database import engine, Base
from models.user import User

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "CareerAI Backend Running"}