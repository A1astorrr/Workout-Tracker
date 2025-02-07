from fastapi import FastAPI
from app.workout.views import router as workout_router
from app.users.views import router as users_router
from fastapi.staticfiles import StaticFiles
from app.pages.views import router as pages_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Трекер тренеровок",
    root_path="/api",
)


# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Include routers
app.include_router(workout_router)
app.include_router(users_router)
app.include_router(pages_router)


origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)