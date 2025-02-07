from pydantic import BaseModel, EmailStr


class SUserAuth(BaseModel):
    email: EmailStr
    password: str
    is_active: bool = True
    
    
class SUserLogin(BaseModel):
    username: str
    email: EmailStr
    password: str
    is_active: bool = True