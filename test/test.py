import pandas as pd
# Use 'db' directly since you are running from the backend folder
from db import engine 

print("Database connected successfully!")
print("File is running...")

# Ensure the path to your CSV is correct relative to this file
try:
    df = pd.read_csv("../datasets/careers.csv")
    print("CSV Loaded Successfully!")
    print(df.head()) # print(df.head()) is cleaner for large datasets
except FileNotFoundError:
    print("Error: could not find careers.csv. Check your folder path!")

# Optional: Load the dataframe into your PostgreSQL database
# df.to_sql('careers', engine, if_exists='replace', index=False)