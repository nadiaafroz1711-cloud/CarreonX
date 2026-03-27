from pydantic import BaseModel
from typing import Optional
from pydantic import BaseModel

class ProfileCreate(BaseModel):
    skills: str
    target_role: str
    experience_level: str

class ProfileResponse(ProfileCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True