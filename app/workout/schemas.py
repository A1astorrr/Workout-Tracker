from pydantic  import BaseModel, ConfigDict

class WorkoutBase(BaseModel):
    duration: int
    type: str
    
class WorkoutCreate(WorkoutBase):
    pass

class WorkoutUpdate(WorkoutBase):
    pass


class Workout(WorkoutBase):
    id: int
    user_id: int
    date: str
    
    model_config = ConfigDict(from_attributes=True)