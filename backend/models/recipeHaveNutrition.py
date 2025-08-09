from sqlalchemy import Integer, Column, ForeignKey
from sqlalchemy.orm import relationship
from backend.db import Base


class RecipeIncHaveNutrition(Base):
    __tablename__ = 'RecipeHaveNutrition'

    id = Column(Integer, primary_key=True, index=True)
    recicpe_id = Column(Integer, ForeignKey(
        "Recipes.id"))
    nutrition_id = Column(Integer, ForeignKey(
        'Nutritions.id'))
    value = Column(Integer, nullable=False)
    percent = Column(Integer, nullable=True)

    contains_nutrition = relationship(
        'Nutritions', back_populates='nutrition_in_recipe', lazy='selectin')
    contains_recipe = relationship(
        'Recipes', back_populates='recipe_has_nutrition', lazy='selectin')