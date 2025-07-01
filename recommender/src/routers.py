from fastapi import APIRouter
from pydantic import BaseModel
from src.controllers import get_recommendations
from typing import List

router = APIRouter()

class RecommendationRequest(BaseModel):
    categories: List[str]
    descriptions: List[str]

@router.post("/")
def recommend(req: RecommendationRequest):
    return get_recommendations(req.categories, req.descriptions)
