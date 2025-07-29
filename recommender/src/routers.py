from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.controllers import (
	get_recommendations,
	refresh_model_addition,
	refresh_model_update,
	refresh_model_removal,
)
from src.model import load_model
from typing import List

router = APIRouter()

class UserPreference(BaseModel):
	category: str
	description: str

class RecommendationRequest(BaseModel):
	userPreferences: List[UserPreference]

class Product(BaseModel):
	id: str
	name: str
	description: str
	category: str
	condition: str

class ProductRequest(BaseModel):
	product: Product

class IdRequest(BaseModel):
	id: str

@router.post("/recommend")
def recommend(req: RecommendationRequest):
	try:
		load_model()
		return get_recommendations(req.userPreferences)
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh/addition")
def refresh_model_adding(req: ProductRequest):
	try:
		load_model()
		print(req.product)
		refresh_model_addition(req.product)
		return {"status": "model refreshed"}
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh/update")
def refresh_model_updating(req: ProductRequest):
	try:
		load_model()
		refresh_model_update(req.product)
		return {"status": "model refreshed"}
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh/removal")
def refresh_model_removing(req: IdRequest):
	try:
		load_model()
		refresh_model_removal(req.id)
		return {"status": "model refreshed"}
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))
