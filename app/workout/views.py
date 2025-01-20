from typing import Annotated
from fastapi import APIRouter,Depends
from app.users.dependencies import get_current_user
from app.users.models import User
from app.workout.schemas import Workout, WorkoutCreate, WorkoutUpdate
from app.workout.crud import WorkoutDAO
from app.workout.exceptions import (
    WorkoutByIdNotFoundException,
    WorkoutNotCreatedException,
    WorkoutNotUpdatedException,
    WorkoutNotDeletedException
)

router = APIRouter(prefix="/workouts", tags=["Workouts 🏃"])


@router.get("/", response_model=list[Workout],)
async def get_workouts(skip: int = 0, limit: int = 100):
    workouts = await WorkoutDAO.find_all()
    return workouts[skip : skip + limit]


@router.get("/{workout_id}/", response_model=Workout)
async def get_workout_by_id(workout_id: int):
    workout = await WorkoutDAO.find_id(workout_id)
    if not workout:
        raise WorkoutByIdNotFoundException
    return workout

@router.post("/", response_model=Workout)
async def create_workout(workout: Annotated[WorkoutCreate, Depends()], user: Annotated[User, Depends(get_current_user)]):
    created = await WorkoutDAO.add(**workout.model_dump())
    if created is None:
        raise WorkoutNotCreatedException
    return created

@router.put("/{workout_id}/")
async def update_workout(workout_id: int, note_update: Annotated[WorkoutUpdate, Depends()], user: Annotated[User, Depends(get_current_user)]):
    updated = await WorkoutDAO.update(workout_id, **note_update.model_dump(exclude_unset=True))
    if updated is None:
        raise WorkoutNotUpdatedException
    return updated

@router.delete("/{workout_id}/")
async def delete_workout(workout_id: int, user: Annotated[User, Depends(get_current_user)]):
    deleted = await WorkoutDAO.delete(id=workout_id)
    if deleted is None:
        raise  WorkoutNotDeletedException
    return {"detail": "Workout deleted successfully"}