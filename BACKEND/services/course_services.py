import pandas as pd

def get_courses_by_career(career: str):
    # Read CSV
   # This tells Python the exact "GPS coordinates" of the file
    df = pd.read_csv(r"C:\CAREERAI_PROJECT\backend\datasets\courses.csv")

    # Filter rows by career
    filtered = df[df["career"] == career]

    # Convert to list
    courses = filtered["course"].tolist()

    return courses