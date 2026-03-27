from fastapi import FastAPI

app = FastAPI()  # This defines the "app" that Uvicorn is looking for

@app.get("/")
def read_root():
    return {"message": "CareerAI API is running"}