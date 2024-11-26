from pydantic import BaseModel

class TaskBase(BaseModel):
    name: str
    state: str = "pending"

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    state: str

class TaskOut(TaskBase):
    id: int

    class Config:
        orm_mode = True
