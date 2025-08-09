from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from db import get_db
from models.ingredients import *
from routers.ingredients.schemas import *
import os
import json
import traceback
from typing import Annotated
from routers.auth.utils import get_current_user
from models.user import User

router = APIRouter()

@router.get("/get-ingredients", response_model=list[Ingredient])
async def get_ingredients(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    pass
