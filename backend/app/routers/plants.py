from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
import uuid

from ..database import get_db
from ..models import Plant, PlantType, WateringHistory, User
from ..services import auth_service

router = APIRouter()

# Pydantic models for request/response
class PlantTypeBase(BaseModel):
    name: str
    name_ar: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None
    care_instructions: Optional[str] = None
    care_instructions_ar: Optional[str] = None

class PlantTypeCreate(PlantTypeBase):
    pass

class PlantTypeResponse(PlantTypeBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class WateringHistoryBase(BaseModel):
    watered_at: datetime
    notes: Optional[str] = None

class WateringHistoryCreate(WateringHistoryBase):
    pass

class WateringHistoryResponse(WateringHistoryBase):
    id: str
    plant_id: str
    
    class Config:
        orm_mode = True

class PlantBase(BaseModel):
    nickname: str
    nickname_ar: Optional[str] = None
    plant_name: str
    plant_name_ar: Optional[str] = None
    latin_name: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None
    location: Optional[str] = None
    location_ar: Optional[str] = None
    watering_interval_days: int = 7
    sunlight_requirements: Optional[str] = None
    sunlight_requirements_ar: Optional[str] = None
    temperature_min: Optional[float] = None
    temperature_max: Optional[float] = None
    humidity_preference: Optional[str] = None
    humidity_preference_ar: Optional[str] = None
    soil_type: Optional[str] = None
    soil_type_ar: Optional[str] = None
    fertilizing_interval_days: Optional[int] = None

class PlantCreate(PlantBase):
    plant_type_id: Optional[str] = None

class PlantUpdate(BaseModel):
    nickname: Optional[str] = None
    nickname_ar: Optional[str] = None
    plant_name: Optional[str] = None
    plant_name_ar: Optional[str] = None
    latin_name: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None
    location: Optional[str] = None
    location_ar: Optional[str] = None
    watering_interval_days: Optional[int] = None
    sunlight_requirements: Optional[str] = None
    sunlight_requirements_ar: Optional[str] = None
    temperature_min: Optional[float] = None
    temperature_max: Optional[float] = None
    humidity_preference: Optional[str] = None
    humidity_preference_ar: Optional[str] = None
    soil_type: Optional[str] = None
    soil_type_ar: Optional[str] = None
    fertilizing_interval_days: Optional[int] = None
    plant_type_id: Optional[str] = None

class PlantResponse(PlantBase):
    id: str
    owner_id: str
    plant_type_id: Optional[str] = None
    photo_url: Optional[str] = None
    last_watered_date: Optional[datetime] = None
    next_watering_date: Optional[datetime] = None
    last_fertilized_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    plant_type: Optional[PlantTypeResponse] = None
    
    class Config:
        orm_mode = True

# Routes
@router.post("/", response_model=PlantResponse, status_code=status.HTTP_201_CREATED)
async def create_plant(
    plant: PlantCreate, 
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    # Check if plant type exists if provided
    if plant.plant_type_id:
        plant_type = db.query(PlantType).filter(PlantType.id == plant.plant_type_id).first()
        if not plant_type:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plant type not found"
            )
    
    # Create new plant
    db_plant = Plant(
        id=str(uuid.uuid4()),
        owner_id=current_user.id,
        **plant.dict()
    )
    
    # Calculate next watering date
    if db_plant.watering_interval_days:
        db_plant.next_watering_date = datetime.now() + timedelta(days=db_plant.watering_interval_days)
    
    db.add(db_plant)
    db.commit()
    db.refresh(db_plant)
    
    return db_plant

@router.get("/", response_model=List[PlantResponse])
async def get_plants(
    current_user: User = Depends(auth_service.get_current_user),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    plants = db.query(Plant).filter(
        Plant.owner_id == current_user.id,
        Plant.is_deleted == False
    ).offset(skip).limit(limit).all()
    
    return plants

@router.get("/{plant_id}", response_model=PlantResponse)
async def get_plant(
    plant_id: str,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    plant = db.query(Plant).filter(
        Plant.id == plant_id,
        Plant.owner_id == current_user.id,
        Plant.is_deleted == False
    ).first()
    
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plant not found"
        )
    
    return plant

@router.put("/{plant_id}", response_model=PlantResponse)
async def update_plant(
    plant_id: str,
    plant_update: PlantUpdate,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    # Get plant
    plant = db.query(Plant).filter(
        Plant.id == plant_id,
        Plant.owner_id == current_user.id,
        Plant.is_deleted == False
    ).first()
    
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plant not found"
        )
    
    # Check if plant type exists if provided
    if plant_update.plant_type_id:
        plant_type = db.query(PlantType).filter(PlantType.id == plant_update.plant_type_id).first()
        if not plant_type:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plant type not found"
            )
    
    # Update plant fields
    update_data = plant_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(plant, key, value)
    
    # Recalculate next watering date if watering interval changed
    if plant_update.watering_interval_days is not None and plant.last_watered_date:
        plant.next_watering_date = plant.last_watered_date + timedelta(days=plant.watering_interval_days)
    
    db.commit()
    db.refresh(plant)
    
    return plant

@router.delete("/{plant_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_plant(
    plant_id: str,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    # Get plant
    plant = db.query(Plant).filter(
        Plant.id == plant_id,
        Plant.owner_id == current_user.id,
        Plant.is_deleted == False
    ).first()
    
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plant not found"
        )
    
    # Soft delete
    plant.is_deleted = True
    db.commit()
    
    return None

@router.post("/{plant_id}/water", response_model=WateringHistoryResponse)
async def water_plant(
    plant_id: str,
    watering: WateringHistoryCreate,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    # Get plant
    plant = db.query(Plant).filter(
        Plant.id == plant_id,
        Plant.owner_id == current_user.id,
        Plant.is_deleted == False
    ).first()
    
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plant not found"
        )
    
    # Create watering history entry
    watering_history = WateringHistory(
        id=str(uuid.uuid4()),
        plant_id=plant.id,
        watered_at=watering.watered_at,
        notes=watering.notes
    )
    
    # Update plant's last watered date and next watering date
    plant.last_watered_date = watering.watered_at
    plant.next_watering_date = watering.watered_at + timedelta(days=plant.watering_interval_days)
    
    db.add(watering_history)
    db.commit()
    db.refresh(watering_history)
    
    return watering_history

@router.get("/{plant_id}/watering-history", response_model=List[WateringHistoryResponse])
async def get_watering_history(
    plant_id: str,
    current_user: User = Depends(auth_service.get_current_user),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    # Check if plant exists and belongs to user
    plant = db.query(Plant).filter(
        Plant.id == plant_id,
        Plant.owner_id == current_user.id,
        Plant.is_deleted == False
    ).first()
    
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plant not found"
        )
    
    # Get watering history
    watering_history = db.query(WateringHistory).filter(
        WateringHistory.plant_id == plant_id
    ).order_by(WateringHistory.watered_at.desc()).offset(skip).limit(limit).all()
    
    return watering_history

@router.post("/{plant_id}/upload-photo", response_model=PlantResponse)
async def upload_plant_photo(
    plant_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    # Get plant
    plant = db.query(Plant).filter(
        Plant.id == plant_id,
        Plant.owner_id == current_user.id,
        Plant.is_deleted == False
    ).first()
    
    if not plant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plant not found"
        )
    
    # In a real app, this would upload the file to a storage service
    # and update the plant's photo_url with the URL of the uploaded file
    # For now, we'll just update with a placeholder URL
    
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/gif"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image (JPEG, PNG, or GIF)"
        )
    
    # Update plant's photo_url
    plant.photo_url = f"/uploads/plants/{plant_id}/{file.filename}"
    db.commit()
    db.refresh(plant)
    
    return plant

# Plant Types routes
@router.post("/types", response_model=PlantTypeResponse, status_code=status.HTTP_201_CREATED)
async def create_plant_type(
    plant_type: PlantTypeCreate,
    current_user: User = Depends(auth_service.get_current_admin_user),
    db: Session = Depends(get_db)
):
    # Create new plant type
    db_plant_type = PlantType(
        id=str(uuid.uuid4()),
        **plant_type.dict()
    )
    
    db.add(db_plant_type)
    db.commit()
    db.refresh(db_plant_type)
    
    return db_plant_type

@router.get("/types", response_model=List[PlantTypeResponse])
async def get_plant_types(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    plant_types = db.query(PlantType).offset(skip).limit(limit).all()
    return plant_types

@router.get("/types/{plant_type_id}", response_model=PlantTypeResponse)
async def get_plant_type(
    plant_type_id: str,
    db: Session = Depends(get_db)
):
    plant_type = db.query(PlantType).filter(PlantType.id == plant_type_id).first()
    
    if not plant_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plant type not found"
        )
    
    return plant_type