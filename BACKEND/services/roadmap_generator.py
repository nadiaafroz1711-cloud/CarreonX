import pandas as pd
import os

# Get the absolute path to the datasets folder to avoid FileNotFoundError
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "datasets", "roadmap.csv")

# Load the dataset
try:
    roadmap_df = pd.read_csv(CSV_PATH)
except FileNotFoundError:
    print(f"Error: Could not find {CSV_PATH}. Check your folder structure.")
    roadmap_df = None

def generate_roadmap(career: str):
    """
    Filters the roadmap_df based on the career and returns steps.
    """
    if roadmap_df is None:
        return "Roadmap data unavailable."
    
    # Example logic: Filter rows where 'career' column matches
    # Adjust 'career_name' to match your actual CSV column header
    recommendations = roadmap_df[roadmap_df['career_name'].str.contains(career, case=False, na=False)]
    
    if recommendations.empty:
        return f"No specific roadmap found for {career}. Start with general programming fundamentals."
    
    # Return the steps (adjust 'steps' to your CSV column name)
    return recommendations['steps'].iloc[0]