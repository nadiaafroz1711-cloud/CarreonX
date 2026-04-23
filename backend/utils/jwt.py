from jose import jwt # type: ignore
from datetime import datetime, timedelta

SECRET_KEY = "your_super_secret_key" # Change this later!
ALGORITHM = "HS256"

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)