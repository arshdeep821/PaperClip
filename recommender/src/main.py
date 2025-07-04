from fastapi import FastAPI
from src.model import make_model_initial, load_model

def initial_setup():
    make_model_initial()
    load_model()
    print("Model and preprocessor created")

initial_setup()

from src.routers import router

app = FastAPI()

app.include_router(router, prefix="/model")
