from fastapi import FastAPI
from app.routers import tasks
from app.database import create_database
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000", 
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await create_database()

app.include_router(tasks.router)
