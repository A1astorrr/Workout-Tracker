from fastapi import FastAPI
from app.workout.views import router as workout_router
from app.users.views import router as users_router

app = FastAPI()

app.include_router(workout_router)
app.include_router(users_router)