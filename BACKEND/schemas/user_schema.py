from pydantic import BaseModel, EmailStr
from typing import Optional

# What the API expects when someone registers
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

# What the API sends back to the frontend (Safe data)
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True # Allows Pydantic to read SQLAlchemy models