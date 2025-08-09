from sqlalchemy import Integer, Column, Text, String, DateTime, func
from sqlalchemy.orm import relationship
from db import Base


class Users(Base):
    __tablename__ = 'Users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(Text, nullable=False)
    hashed_password = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now())
    last_active_at = Column(DateTime, default=None)