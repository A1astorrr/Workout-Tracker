from sqlalchemy import NullPool
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings
    
engine = create_async_engine(
    settings.database_url,
    echo=False,
)

async_session = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=True)

class Base(DeclarativeBase):
    pass