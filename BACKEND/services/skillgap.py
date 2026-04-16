import pandas as pd
import os

# Build the path to your CSV
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "datasets", "roadmap.csv")

# Global variable for the DataFrame
careers_df = None

if os.path.exists(CSV_PATH):
    try:
        # Load the CSV so 'careers_df' is defined for the whole file
        careers_df = pd.read_csv(CSV_PATH)
        print("✅ Success: roadmap.csv loaded in skillgap.py")
    except Exception as e:
        print(f"❌ Error reading CSV: {e}")
else:
    print(f"❌ Critical Error: Could not find CSV at {CSV_PATH}")

def skill_gap(career: str, user_skills: str):
    """
    Calculates the gap between user skills and career requirements.
    """
    if careers_df is None:
        return {"error": "Database not loaded"}

    try:
        # 1. Find the career row (Ensure your CSV column is named 'career')
        career_row = careers_df[careers_df["career"].str.lower() == career.lower()].iloc[0]
        
        # 2. Logic to compare skills (Example)
        required_skills = str(career_row["skills"]).split(",")
        user_skills_list = [s.strip().lower() for s in user_skills.split(",")]
        
        missing = [s for s in required_skills if s.strip().lower() not in user_skills_list]
        
        return {
            "career": career,
            "match_score": f"{int(((len(required_skills) - len(missing)) / len(required_skills)) * 100)}%",
            "missing_skills": missing
        }
    except Exception as e:
        return {"error": f"Career '{career}' not found or error occurred: {str(e)}"}