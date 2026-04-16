import pandas as pd
import os
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/learning", tags=["Learning Roadmap"])

# Dynamically resolve path relative to this file
BASE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "datasets", "roadmap.csv")

@router.get("/roadmap")
async def get_roadmap(career: str):
    try:
        # 1. Check if file exists and isn't empty
        if not os.path.exists(BASE_PATH) or os.path.getsize(BASE_PATH) == 0:
            raise HTTPException(status_code=500, detail="Roadmap data file is empty or missing.")

        # 2. Read the CSV
        df = pd.read_csv(BASE_PATH)

        # 3. Filter by career (Case-insensitive)
        filtered_df = df[df['career'].str.contains(career, case=False, na=False)]

        if filtered_df.empty:
            return {"message": f"No roadmap found for {career}", "steps": []}

        # 4. Convert to list of dictionaries
        steps = filtered_df.to_dict(orient="records")
        return {"career": career, "steps": steps}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))