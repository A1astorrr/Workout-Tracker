from fastapi import HTTPException, status

UserAlreadyExistsException = HTTPException(
    status_code=status.HTTP_409_CONFLICT, 
    detail="The user already exists",
)

IncorrectEmailorPasswordException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED, 
    detail="Incorrect email or password",
)

TokenExpiredException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED, 
    detail="Token expired",
)

TokenAbsentException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED, 
    detail="Token is missing",
)

IncorrectTokenException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED, 
    detail="Invalid token",
)

UserNotFoundException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED, 
)
