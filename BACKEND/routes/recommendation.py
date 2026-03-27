from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class CareerRequest(BaseModel):
    skills: List[str]
    domain: str = "AI/ML"

def generate_steps(missing_skills: list, domain: str):
    steps = []
    if not missing_skills:
        return ["Skills complete! Focus on advanced projects."]
    for i, skill in enumerate(missing_skills, 1):
        steps.append(f"Step {i}: Master {skill.capitalize()}.")
    return steps

@router.post("/analyze-and-roadmap")
def analyze_career(data: CareerRequest):
    user_skills = [s.lower() for s in data.skills]
    domain = data.domain

    requirements = {
        "AI/ML": ["python", "machine learning", "statistics", "pytorch"],
        "Web": ["html", "css", "javascript", "fastapi"],
        "Mobile": ["flutter", "dart", "firebase"]
    }

    if domain not in requirements:
        raise HTTPException(status_code=400, detail="Domain not found.")

    required_skills = requirements.get(domain)
    gap = list(set(required_skills) - set(user_skills))
    roadmap = generate_steps(gap, domain)

    return {
        "domain": domain,
        "missing_skills": gap,
        "roadmap": roadmap
    }