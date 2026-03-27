from BACKEND.models.models import User
from BACKEND.database.db import SessionLocal

def create_user(name, email, password):
    db = SessionLocal()

    user = User(
        name=name,
        email=email,
        password=password
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()

    return user