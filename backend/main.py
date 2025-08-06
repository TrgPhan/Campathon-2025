from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc, func, delete, update
from models import ingredients, nutritions, recipeHaveNutrition, recipeIncludeIngredient, recipes
from db import Base, engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://your-frontend-domain.com",
    "http://localhost:3000",
    "http://192.168.56.1:3000"

]


@app.on_event("startup")
async def startup_event():
    # create a new database if there is none
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)