from models.user_model import User
from db import SessionLocal

def create_user(name, email, password):
    db = SessionLocal()

    new_user = User(
        name=name,
        email=email,
        password=password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()

    return new_user