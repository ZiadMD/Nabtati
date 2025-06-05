from sqlalchemy import Boolean, Column, String, Integer, DateTime, ForeignKey, Float, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from ..database import Base

# Plant model
class Plant(Base):
    __tablename__ = "plants"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    nickname = Column(String)
    nickname_ar = Column(String, nullable=True)
    plant_name = Column(String)
    plant_name_ar = Column(String, nullable=True)
    latin_name = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    description_ar = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    location_ar = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    watering_interval_days = Column(Integer, default=7)
    last_watered_date = Column(DateTime(timezone=True), nullable=True)
    next_watering_date = Column(DateTime(timezone=True), nullable=True)
    sunlight_requirements = Column(String, nullable=True)
    sunlight_requirements_ar = Column(String, nullable=True)
    temperature_min = Column(Float, nullable=True)
    temperature_max = Column(Float, nullable=True)
    humidity_preference = Column(String, nullable=True)
    humidity_preference_ar = Column(String, nullable=True)
    soil_type = Column(String, nullable=True)
    soil_type_ar = Column(String, nullable=True)
    fertilizing_interval_days = Column(Integer, nullable=True)
    last_fertilized_date = Column(DateTime(timezone=True), nullable=True)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    owner_id = Column(String, ForeignKey("users.id"))
    plant_type_id = Column(String, ForeignKey("plant_types.id"), nullable=True)
    
    # Relationships
    owner = relationship("User", back_populates="plants")
    plant_type = relationship("PlantType", back_populates="plants")
    watering_history = relationship("WateringHistory", back_populates="plant")
    diagnoses = relationship("Diagnosis", back_populates="plant")

# Plant Type model
class PlantType(Base):
    __tablename__ = "plant_types"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True)
    name_ar = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    description_ar = Column(Text, nullable=True)
    care_instructions = Column(Text, nullable=True)
    care_instructions_ar = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    plants = relationship("Plant", back_populates="plant_type")

# Watering History model
class WateringHistory(Base):
    __tablename__ = "watering_history"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    watered_at = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text, nullable=True)
    
    # Foreign keys
    plant_id = Column(String, ForeignKey("plants.id"))
    
    # Relationships
    plant = relationship("Plant", back_populates="watering_history")