from app.workout.models import Workout
from app.dao.base import BaseDAO
from app.database import async_session


class BookDAO(BaseDAO):
    model = Workout
    
    @classmethod
    async def update(cls, id: int, **data):
        async with async_session() as session:
            updated = await cls.find_id(id)
            if updated is None:
                return None
            for key, value in data.items():
                if hasattr(updated, key):
                    setattr(updated, key, value)

            session.add(updated)
            await session.commit()
            return updated