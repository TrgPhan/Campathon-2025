#                    _oo8oo_
#                   088888880
#                   88" + "88
#                   (| -_- |)
#                   0\  *  /0
#                  __/'---'\__
#               .' \\|     |//' .
#              / \\|||  :  |||// \
#             / _||||| -:- |||||- \
#            |   | \\\  -  /// |   |
#            | \_|  ''\---/''  |_/ |
#            \  .-\__  '-'  __/-.  /
#          ___'. .'  /--.--\  '. .'___
#        ."" '< '.___\_<|>_/___.' >' "".
#       | | : '- \'.;'\ _ /';.'/ - ' : | |
#       \  \ '_.  \____\ /____/  .-'  /  /
#   ====='-.____.___ \_____/ ___.-'__.-'=====
#                    '=---='
#
#   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#         Phật phù hộ, không bao giờ BUG
#   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc, func, delete, update
from models import ingredients, nutritions, recipeHaveNutrition, recipeIncludeIngredient, recipes, users
from db import Base, engine, get_db, AsyncSessionLocal
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import json

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://your-frontend-domain.com",
    "http://localhost:3000",
    "http://192.168.56.1:3000"

]

# This function is only half done, and will need further improvements
# Not yet implemented functionalities:
# Convert comment to a single string of comment instead of NLP's output
# Add nutritions, recipeHaveNutrition
# Convert size to a single string of size, similar to comment
async def init_db_data():
    async with AsyncSessionLocal() as db:
        # creaate a set of added ingredients to check for duplication
        added_ingredients = set()

        # load the data
        with open('processed_recipes.json', 'r', encoding="utf-8") as f:
            processed_recipes = json.load(f)

        # Get the recipe's basic data
        for recipe in processed_recipes:
            name = recipe['name']
            description = recipe['description']
            image = recipe['image']
            prep_time = recipe['prep_time']
            additional_time = recipe['additional_time']
            cook_time = recipe['cook_time']
            chill_time = recipe['chill_time']
            total_time = recipe['total_time']
            servings = recipe['servings']
            yields = recipe['yield']
            recipe_ingredients = recipe['ingredients']

            # create a new row
            new_recipe = recipes.Recipes(
                name = name,
                description = description,
                image_url = image,
                prep_time = prep_time,
                additional_time = additional_time,
                cook_time = cook_time,
                chill_time = chill_time,
                total_time = total_time,
                servings = servings,
                yields = yields
            )

            # add the data and await for flush to get its id
            db.add(new_recipe)
            await db.flush()

            recipe_id = new_recipe.id

            # loop through all the recipe's ingredients
            for ingredient in recipe_ingredients:
                ingredient_name = ingredient['Name']
                if ingredient['Amount']:
                    ingredient_amount = ingredient['Amount'][0]
                else:
                    ingredient_amount = None
                ingredient_size = ingredient['Size']
                preparation = ingredient["Preparation"]
                prepared_ingredient = True if preparation is not None else False
                comment = ingredient['Comment']

                # Check for duplication
                if ingredient_name not in added_ingredients:
                    ingredient_unit = ingredient_amount['Unit'] if ingredient_amount is not None else None

                    new_ingredient = ingredients.Ingredients(
                        name = ingredient_name,
                        unit = ingredient_unit
                    )
                    # add the data and await for flush to get its id
                    db.add(new_ingredient)
                    await db.flush()

                    ingredient_id = new_ingredient.id

                    added_ingredients.add(ingredient_name)
                else:
                    ingredient_id = await db.execute(
                        select(ingredients.Ingredients.id).where(
                            ingredients.Ingredients.name == ingredient_name))
                    ingredient_id = ingredient_id.scalar_one()
                
                # handle some exceptions of quantity
                if ingredient_amount is not None:
                    # null quantity
                    if ingredient_amount['Quantity'] == "":
                        ingredient_amount = None
                    # string quantity, but there is text and number
                    # text example: "half"
                    # number example: "15-20"
                    elif isinstance(ingredient_amount['Quantity'], str):
                        try:
                            min, max = map(float, ingredient_amount['Quantity'].split('-'))
                            ingredient_amount = (min + max) / 2
                        except Exception as e:
                            ingredient_amount = None
                    else:
                        ingredient_amount = ingredient_amount['Quantity']
                    
                new_ingredient_in_recipe = recipeIncludeIngredient.RecipeIncludeIngredient(
                    recipe_id = recipe_id,
                    ingredient_id = ingredient_id,
                    size = ingredient_size,
                    amount = ingredient_amount,
                    preparation = preparation,
                    prepared_ingredient = prepared_ingredient,
                    comment = comment
                )

                db.add(new_ingredient_in_recipe)
                    
        await db.commit()


@app.on_event("startup")
async def startup_event():
    # create a new database if there is none
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await init_db_data()


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)