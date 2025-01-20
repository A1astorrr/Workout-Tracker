from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.users.models import User
from typing import Annotated
from sqlalchemy import func, ForeignKey, String
import datetime


created_at = Annotated[datetime.datetime, mapped_column(server_default=func.now())]


class Workout(Base):
    __tablename__ = "workouts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    type: Mapped[str] = mapped_column(String(50))
    duration: Mapped[int]
    date: Mapped[created_at]
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    user = relationship(User, back_populates="workouts")

    def __repr__(self) -> str:
        return (
            f"<Workout(id={self.id}, user_id={self.user_id}, "
            f"date='{self.date}', duration={self.duration}, type='{self.type}')>"
        )

    def __str__(self) -> str:
        return f"Workout: {self.type}"
