from sqlalchemy import Integer, Column, Text, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from db import Base


class RecipeIncludeIngredient(Base):
    __tablename__ = 'RecipeIncludeIngredient'

    id = Column(Integer, primary_key=True, index=True)
    recicpe_id = Column(Integer, ForeignKey(
        "Recipes.id"))
    ingredient_id = Column(Integer, ForeignKey(
        'Ingredients.id'))
    size = Column(String, nullable=False)
    amount = Column(Integer, nullable=False)
    preparation = Column(Text, nullable=True)
    prepared_ingredient = Column(Boolean, default=False)
    comment = Column(Text, nullable=True)

    contains_ingredient = relationship(
        'Ingredients', back_populates='ingredient_in_recipe', lazy='selectin')
    contains_recipe = relationship(
        'Recipes', back_populates='recipe_has_ingredient', lazy='selectin')