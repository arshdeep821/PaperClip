from fastapi import FastAPI
from src.model import make_model_initial

def initial_setup():
    make_model_initial()
    print("Model and preprocessor created")

initial_setup()

from src.routers import router as recommend_router

app = FastAPI()

app.include_router(recommend_router, prefix="/recommend")
