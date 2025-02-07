from fastapi import APIRouter, Depends, Response, status
from app.users.auth import authenticate_user, create_access_token, get_password_hash
from app.users.crud import UsersDAO
from app.users.exceptions import (
    CannotAddDataToDatabase,
    IncorrectEmailorPasswordException,
    UserAlreadyExistsException,
)
from app.users.models import User
from app.users.schemas import SUserAuth, SUserLogin

router = APIRouter(
    prefix="/auth",
    tags=["Auth & Users"],
)

@router.post("/register")
async def register_user(user_data: SUserLogin):
    existing_user = await UsersDAO.find_one_or_none(email=user_data.email)
    if existing_user:
        raise UserAlreadyExistsException
    hashed_password = get_password_hash(user_data.password)
    new_user = await UsersDAO.add(
        username=user_data.username, email=user_data.email, hashed_password=hashed_password
    )
    if not new_user:
        raise CannotAddDataToDatabase



@router.post("/login")
async def login_user(response: Response, user_data: SUserAuth):
    user = await authenticate_user(user_data.email, user_data.password)
    if not user:
        raise IncorrectEmailorPasswordException
    access_token = create_access_token({"sub": str(user.id)})
    response.set_cookie("workout_access_token", access_token, httponly=True)
    return {"username": user.username}



@router.post("/logout")
async def logout_user(response: Response):
    response.delete_cookie("workout_access_token")
    return {"detail": "The user has logged out."}


@router.post("/check-auth")
async def check_auth(response: Response, user_data: SUserAuth):
    user = await authenticate_user(user_data.email, user_data.password)
    if not user:
        raise IncorrectEmailorPasswordException
    return {"detail": "Авторизация успешна"}