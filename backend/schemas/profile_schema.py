from pydantic import BaseModel
from typing import List, Optional

class ProfileBase(BaseModel):
    domain: str
    skills: List[str]

class ProfileCreate(ProfileBase):
    user_id: int

class ProfileUpdate(BaseModel):
    domain: Optional[str] = None
    skills: Optional[List[str]] = None

class ProfileResponse(ProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True