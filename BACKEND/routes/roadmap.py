from fastapi import APIRouter

router = APIRouter()

@router.post("/roadmap")
def roadmap(data: dict):
    skills = data.get("skills", [])

    return {
        "beginner": skills[:2],
        "intermediate": skills[2:4],
        "advanced": skills[4:]
    }