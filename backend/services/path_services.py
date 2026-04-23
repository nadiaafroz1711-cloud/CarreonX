import pandas as pd
from sqlalchemy.orm import Session
from backend.models.progress import UserProgress
from backend.services.mapping_services import ROADMAP_CSV

def generate_weekly_plan(user_id: int, db: Session):
    # 1. Get the roadmap
    df_roadmap = pd.read_csv(ROADMAP_CSV)

    # 2. Get completed skills from DB
    completed = db.query(UserProgress).filter(
        UserProgress.user_id == user_id,
        UserProgress.category == "skill"
    ).all()
    done_list = [item.title for item in completed]

    # 3. Filter for remaining skills only
    remaining_skills = df_roadmap[~df_roadmap['skill'].isin(done_list)]

    if remaining_skills.empty:
        return {"message": "Roadmap complete! Time for a new career goal."}

    # 4. Split skills into a 4-week plan
    plan = []
    skills_list = remaining_skills['skill'].tolist()
    chunk_size = max(1, len(skills_list) // 4)

    for i in range(4):
        start = i * chunk_size
        # For the last week, take all remaining skills
        end = (i + 1) * chunk_size if i < 3 else len(skills_list)

        week_skills = skills_list[start:end]
        if week_skills:
            plan.append({
                "week": i + 1,
                "focus": week_skills,
                "goal": f"Master {len(week_skills)} key skills"
            })

    return {
        "user_id": user_id,
        "plan_duration": "4 Weeks",
        "weekly_breakdown": plan
    }