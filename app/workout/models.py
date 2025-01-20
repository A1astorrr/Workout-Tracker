from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.users.models import User
from typing import Annotated
from sqlalchemy import func, ForeignKey, String
from datetime import datetime


created_at = Annotated[datetime, mapped_column(server_default=func.now())]


class Workout(Base):
    __tablename__ = "workouts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    type: Mapped[str] = mapped_column(String(50))
    duration: Mapped[int]
    date_created: Mapped[created_at]
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    user = relationship(User, back_populates="workouts")

    @property
    def date(self):
        if self.date_created:
            return self.date_created.isoformat() 

    def __repr__(self) -> str:
        return (
            f"<Workout(id={self.id}, user_id={self.user_id}, "
            f"date='{self.date_created}', duration={self.duration}, type='{self.type}')>"
        )

    def __str__(self) -> str:
        return f"Workout: {self.type}"
