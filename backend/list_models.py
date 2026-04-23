import os
from dotenv import load_dotenv
load_dotenv()
try:
    from google import genai
    api_key = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    print("Listing models...")
    for model in client.models.list():
        print(model.name)
except Exception as e:
    print("ERROR:", e)
