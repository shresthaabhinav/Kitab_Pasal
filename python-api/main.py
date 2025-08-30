# conda activate recomm_project
# cd python-api
# uvicorn main:app --reload

# anaconda -> conda activate recomm_project -> pip install
# pydantic, fastapi, uvicorn

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

from functions import function_name

app = FastAPI()

# --- CORS Configuration ---
origins = [
    "http://localhost:5173", # React frontend port
    "http://localhost:1000" # Express
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# --- Pydantic Models for Request/Response Validation ---
class RecommendationRequest(BaseModel):
    book_name: str
    author_name: str
    rating: int
    
# --- API Endpoints ---
@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI Python Backend!"}

@app.post("/api/recommendation")
async def recommendation(request: RecommendationRequest):
    response = function_name()
    try:
        return {
            "response": response

        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in summarizing: {str(e)}")


# You can optionally run the app directly from this file for testing
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)