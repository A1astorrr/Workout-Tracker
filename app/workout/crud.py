from sqlalchemy import select
from app.workout.models import Workout
from app.dao.base import BaseDAO
from app.database import async_session


class WorkoutDAO(BaseDAO):
    model = Workout

    @classmethod
    async def update(cls, id: int, **data):
        async with async_session() as session:
            stmt = select(cls.model).where(cls.model.id == id)
            result = await session.execute(stmt)
            updated = result.scalar_one_or_none()

            if updated is None:
                return None

            for key, value in data.items():
                if hasattr(updated, key):
                    setattr(updated, key, value)

            session.add(updated)
            await session.commit()
            await session.refresh(updated)
            return updated
