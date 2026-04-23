from fastapi import APIRouter, Depends
from pydantic import BaseModel
from backend.services.recommendation import get_recommendation

router = APIRouter(prefix="/recommendation", tags=["Recommendation"])

class CareerRequest(BaseModel):
    career: str
    skills: str

@router.post("/career")
def career_recommendation(req: CareerRequest):
    return get_recommendation(req.career, req.skills)