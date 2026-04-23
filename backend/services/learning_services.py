from sqlalchemy.orm import Session
from backend.models.progress import UserProgress

def update_learning(db: Session, user_id: int, courses: str, projects: str, skills: str, hours: float):
    """
    Records learning progress entries for courses, projects, and skills.
    Each entry is stored as a UserProgress row with category and title.
    """
    entries = []

    if courses:
        for course in courses.split(","):
            entry = UserProgress(
                user_id=user_id,
                title=course.strip(),
                category="course",
                completion_percentage=100.0
            )
            db.add(entry)
            entries.append(entry)

    if projects:
        for project in projects.split(","):
            entry = UserProgress(
                user_id=user_id,
                title=project.strip(),
                category="project",
                completion_percentage=100.0
            )
            db.add(entry)
            entries.append(entry)

    if skills:
        for skill in skills.split(","):
            entry = UserProgress(
                user_id=user_id,
                title=skill.strip(),
                category="skill",
                completion_percentage=100.0
            )
            db.add(entry)
            entries.append(entry)

    db.commit()
    return {"message": f"Saved {len(entries)} learning entries", "user_id": user_id}