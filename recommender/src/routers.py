from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.controllers import get_recommendations
from src.model import make_model_initial, load_model
from typing import List

router = APIRouter()

class UserPreference(BaseModel):
	category: str
	description: str

class RecommendationRequest(BaseModel):
	userPreferences: List[UserPreference]

@router.post("/recommend")
def recommend(req: RecommendationRequest):
	try:
		return get_recommendations(req.userPreferences)
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh")
def refresh_model():
	try:
		make_model_initial()
		load_model()
		return {"status": "model refreshed"}
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))
