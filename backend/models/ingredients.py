from sqlalchemy import Integer, Column, Text, String
from sqlalchemy.orm import relationship
from backend.db import Base


class Ingredients(Base):
    __tablename__ = 'Ingredients'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    unit = Column(String, nullable=False)

    ingredient_in_recipe = relationship(
        'RecipeIncludeIngredient', back_populates='contains_ingredient', lazy='selectin')