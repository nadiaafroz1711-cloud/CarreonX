from fastapi import APIRouter, Query
from typing import List

router = APIRouter(prefix="/youtube", tags=["YouTube"])

@router.get("/recommend")
async def get_youtube_recommendations(skills: str = Query(..., description="Comma separated skills")):
    skill_list = [s.strip() for s in skills.split(",")]
    
    recommendations = []
    for skill in skill_list:
        recommendations.append({
            "skill": skill,
            "queries": [
                f"{skill} full course for beginners",
                f"{skill} crash course 2024",
                f"Advanced {skill} projects"
            ],
            "channels": ["Fireship", "FreeCodeCamp", "Traversy Media"] 
        })
    
    return {"recommendations": recommendations}