from fastapi import FastAPI
from app.workout.views import router as workout_router

app = FastAPI()

app.include_router(workout_router)