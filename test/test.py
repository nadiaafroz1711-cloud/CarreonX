import pandas as pd
from BACKEND.database.database import engine

print("Database connected successfully!")
print("File is running...")

df = pd.read_csv("../datasets/careers.csv")

print(df)