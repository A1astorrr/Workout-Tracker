from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates


router = APIRouter(
    prefix='/pages',
    tags=["Фронтенд"]
)


templates = Jinja2Templates(directory="app/templates")


@router.get("/", response_class=HTMLResponse)
async def index_page(request: Request):
    return templates.TemplateResponse("base.html", {"request": request})

@router.get("/register", response_class=HTMLResponse)
async def registration_page(request: Request):
    return templates.TemplateResponse("auth/register.html", {"request": request})



@router.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("auth/login.html", {"request": request})