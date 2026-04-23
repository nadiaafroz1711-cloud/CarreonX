import os
from dotenv import load_dotenv
load_dotenv()
try:
    from google import genai
    api_key = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents="Hello"
    )
    print("SUCCESS:", response.text)
except Exception as e:
    print("ERROR:", str(e))
