from fastapi import HTTPException, status

WorkoutByIdNotFoundException = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Workout not found"
)

WorkoutNotCreatedException = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Workout not created"
)

WorkoutNotUpdatedException = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Workout not updated"
)

WorkoutNotDeletedException = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Workout not deleted"
)