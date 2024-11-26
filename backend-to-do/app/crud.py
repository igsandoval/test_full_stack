from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import Task
from app.schemas import TaskCreate, TaskUpdate

async def get_tasks(db: AsyncSession):
    result = await db.execute(select(Task))
    return result.scalars().all()

async def create_task(db: AsyncSession, task: TaskCreate):
    new_task = Task(name=task.name, state=task.state)
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    return new_task

async def update_task(db: AsyncSession, task_id: int, task: TaskUpdate):
    db_task = await db.get(Task, task_id)
    if not db_task:
        return None
    for key, value in task.dict(exclude_unset=True).items():
        setattr(db_task, key, value)
    await db.commit()
    await db.refresh(db_task)
    return db_task

async def delete_task(db: AsyncSession, task_id: int):
    db_task = await db.get(Task, task_id)
    if not db_task:
        return None
    await db.delete(db_task)
    await db.commit()
    return db_task
