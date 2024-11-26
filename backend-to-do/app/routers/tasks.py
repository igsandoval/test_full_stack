from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import SessionLocal
from app import crud, schemas

router = APIRouter(prefix="/tasks", tags=["tasks"])

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.get("/", response_model=list[schemas.TaskOut])
async def read_tasks(db: AsyncSession = Depends(get_db)):
    return await crud.get_tasks(db)

@router.post("/", response_model=schemas.TaskOut)
async def create_task(task: schemas.TaskCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_task(db, task)

@router.patch("/{task_id}", response_model=schemas.TaskOut)
async def update_task(task_id: int, task: schemas.TaskUpdate, db: AsyncSession = Depends(get_db)):
    updated_task = await crud.update_task(db, task_id, task)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

@router.delete("/{task_id}", response_model=schemas.TaskOut)
async def delete_task(task_id: int, db: AsyncSession = Depends(get_db)):
    deleted_task = await crud.delete_task(db, task_id)
    if not deleted_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return deleted_task
