from fastapi import APIRouter

router = APIRouter()  # This creates the 'router' attribute main.py is looking for

# Ensure your endpoint decorators use @router:
@router.get("/interview")
async def get_interview_details():
    return {"message": "Interview route active"}