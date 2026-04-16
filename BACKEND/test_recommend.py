import sys
import os
import json
# Insert project root properly
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + "/.."))

from backend.routes.recommendation import career_recommendation, CareerRequest

print("Testing Recommendation Service...")
test_req = CareerRequest(career="Data Analyst", skills="SQL, Python")
result = career_recommendation(test_req)
print(json.dumps(result, indent=2))
print("Test complete.")











