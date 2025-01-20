from datetime import datetime, timezone

import jwt
from fastapi import Depends, Request
from jwt.exceptions import InvalidTokenError

from app.config import settings
from app.users.crud import UsersDAO
from app.users.exceptions import (
    IncorrectTokenException,
    TokenAbsentException,
    TokenExpiredException,

    UserNotFoundException,
)
from app.users.models import User


def get_token(request: Request):
    token = request.cookies.get("workout_access_token")
    if not token:
        raise TokenAbsentException
    return token



async def get_current_user(token: str = Depends(get_token)):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            settings.ALGORITHM,
        )
    except InvalidTokenError:
        raise IncorrectTokenException
    expire: str = payload.get("exp")
    if (not expire) or (int(expire) < datetime.now(timezone.utc).timestamp()):
        raise TokenExpiredException
    user_id: str = payload.get("sub")
    if not user_id:
        raise UserNotFoundException
    user = await UsersDAO.find_id(int(user_id))
    if not user:
        raise UserNotFoundException
    return user

    

