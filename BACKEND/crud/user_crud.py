# Import from the folder 'models' and file 'user'
from backend.models.user import User

# Import from the database connection module
from backend.database.connection import SessionLocal

def create_user(username, email, hashed_password):
    db = SessionLocal()
    
    user = User(
        username=username,
        email=email,
        hashed_password=hashed_password
    )
    
    db.add(user)
    db.commit()   # <--- CRITICAL: You must commit to save to the database
    db.refresh(user)
    db.close()
    
    return user