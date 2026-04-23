from fastapi import APIRouter
from backend.services.course_services import get_courses_by_career
router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("/recommend")
def recommend_courses(career: str):
    courses = get_courses_by_career(career)
    return {"career": career, "courses": courses}