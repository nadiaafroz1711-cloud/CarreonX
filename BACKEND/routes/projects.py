from fastapi import APIRouter

router = APIRouter() # This creates the 'router' attribute main.py is looking for

# Now, ensure all your functions use @router instead of @app
@router.get("/projects")
async def get_projects():
    return {"message": "Projects route active"}