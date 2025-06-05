from sqlalchemy import Boolean, Column, String, Integer, DateTime, ForeignKey, Float, Table, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from ..database import Base

# Diagnosis model
class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    image_url = Column(String)
    condition = Column(String)
    condition_ar = Column(String, nullable=True)
    confidence = Column(Float)  # Percentage confidence of the diagnosis
    description = Column(Text)
    description_ar = Column(Text, nullable=True)
    treatment = Column(JSON)  # List of treatment steps
    treatment_ar = Column(JSON, nullable=True)  # List of treatment steps in Arabic
    prevention_tips = Column(JSON, nullable=True)  # List of prevention tips
    prevention_tips_ar = Column(JSON, nullable=True)  # List of prevention tips in Arabic
    is_resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    user_id = Column(String, ForeignKey("users.id"))
    plant_id = Column(String, ForeignKey("plants.id"))
    
    # Relationships
    user = relationship("User", back_populates="diagnoses")
    plant = relationship("Plant", back_populates="diagnoses")

# Plant Condition model (for ML model reference)
class PlantCondition(Base):
    __tablename__ = "plant_conditions"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True)
    name_ar = Column(String, nullable=True)
    description = Column(Text)
    description_ar = Column(Text, nullable=True)
    treatment = Column(JSON)  # List of treatment steps
    treatment_ar = Column(JSON, nullable=True)  # List of treatment steps in Arabic
    prevention_tips = Column(JSON, nullable=True)  # List of prevention tips
    prevention_tips_ar = Column(JSON, nullable=True)  # List of prevention tips in Arabic
    image_examples = Column(JSON, nullable=True)  # List of example image URLs
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())