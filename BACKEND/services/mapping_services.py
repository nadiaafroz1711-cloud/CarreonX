import pandas as pd
import os
from sqlalchemy.orm import Session
from backend.models.progress import UserProgress

# Dynamically resolve paths relative to this file
_DATASETS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "datasets")
ROADMAP_CSV = os.path.join(_DATASETS_DIR, "roadmap.csv")
COURSES_CSV = os.path.join(_DATASETS_DIR, "courses.csv")

def get_skill_gap_recommendations(user_id: int, db: Session):
    # 1. Load Roadmap and Courses
    try:
        df_roadmap = pd.read_csv(ROADMAP_CSV)
        df_courses = pd.read_csv(COURSES_CSV)
    except Exception as e:
        return {"error": f"CSV Load Error: {str(e)}"}

    # 2. Get skills user HAS completed from DB
    completed_rows = db.query(UserProgress).filter(
        UserProgress.user_id == user_id,
        UserProgress.category == "skill"
    ).all()
    completed_skills = [item.title for item in completed_rows]

    # 3. Identify the "Gaps" (Skills in roadmap NOT in completed_skills)
    # Assuming roadmap.csv has a column named 'skill'
    all_skills = df_roadmap['skill'].unique().tolist()
    missing_skills = [s for s in all_skills if s not in completed_skills]

    if not missing_skills:
        return {"message": "No gaps found! You are up to date.", "recommendations": []}

    # 4. Map Gaps to Courses
    # Search courses.csv for the first 2 missing skills to keep it focused
    gap_recommendations = []
    for skill in missing_skills[:3]: 
        # Match skill name against course titles or categories
        matches = df_courses[df_courses['course_title'].str.contains(skill, case=False, na=False)]
        if not matches.empty:
            course_data = matches.head(2).to_dict(orient="records")
            gap_recommendations.append({
                "gap_skill": skill,
                "suggested_courses": course_data
            })

    return {
        "user_id": user_id,
        "missing_skills_count": len(missing_skills),
        "top_gaps": missing_skills[:3],
        "recommendations": gap_recommendations
    }