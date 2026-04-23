from pathlib import Path

import pandas as pd


DATASET_PATH = Path(__file__).resolve().parent.parent / "datasets" / "courses.csv"


def get_courses_by_career(career: str):
    df = pd.read_csv(DATASET_PATH)
    # Use contains for better matching (e.g. "Data Science" matches "Data Science & AI")
    filtered = df[df["career"].str.contains(career.strip(), case=False, na=False)]
    
    # If no match, try the other way around
    if filtered.empty:
        filtered = df[df["career"].apply(lambda x: x.lower() in career.lower() or career.lower() in x.lower())]

    return [
        {
            "title": row["course"],
            "platform": row.get("platform", "Self-paced"),
        }
        for _, row in filtered.iterrows()
    ]
