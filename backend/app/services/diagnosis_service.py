import os
import uuid
from typing import Optional, Tuple, Dict, Any
from fastapi import UploadFile
import aiofiles
import numpy as np
import json
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
UPLOAD_DIR = "uploads/diagnoses"
MODEL_PATH = "../ml_model/model_export/plant_disease_model.h5"
CLASS_MAPPING_PATH = "../ml_model/model_export/class_mapping.json"

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mock diagnosis results for development
MOCK_CONDITIONS = [
    {
        "id": "healthy",
        "name": "Healthy",
        "name_ar": "صحي",
        "confidence": 0.95,
        "description": "The plant appears to be healthy with no visible signs of disease or pest infestation.",
        "description_ar": "النبات يبدو صحيًا بدون علامات مرئية للمرض أو إصابة الآفات.",
        "treatment": "No treatment needed. Continue with regular care.",
        "treatment_ar": "لا يحتاج إلى علاج. استمر في الرعاية المنتظمة.",
        "prevention": "Maintain regular watering, appropriate light, and occasional fertilizing.",
        "prevention_ar": "حافظ على الري المنتظم، والضوء المناسب، والتسميد العرضي."
    },
    {
        "id": "leaf_spot",
        "name": "Leaf Spot Disease",
        "name_ar": "مرض تبقع الأوراق",
        "confidence": 0.85,
        "description": "Leaf spot is a common plant disease characterized by brown or black spots on leaves.",
        "description_ar": "تبقع الأوراق هو مرض نباتي شائع يتميز ببقع بنية أو سوداء على الأوراق.",
        "treatment": "Remove affected leaves. Apply fungicide if severe. Ensure good air circulation.",
        "treatment_ar": "قم بإزالة الأوراق المصابة. ضع مبيدًا فطريًا إذا كان شديدًا. تأكد من وجود دورة هوائية جيدة.",
        "prevention": "Avoid overhead watering. Space plants properly. Keep garden clean of debris.",
        "prevention_ar": "تجنب الري العلوي. ضع النباتات بشكل صحيح. حافظ على نظافة الحديقة من البقايا."
    },
    {
        "id": "powdery_mildew",
        "name": "Powdery Mildew",
        "name_ar": "البياض الدقيقي",
        "confidence": 0.78,
        "description": "Powdery mildew appears as white powdery spots on leaves and stems.",
        "description_ar": "يظهر البياض الدقيقي كبقع بيضاء مسحوقية على الأوراق والسيقان.",
        "treatment": "Apply fungicide or a mixture of baking soda, water, and soap. Remove severely affected parts.",
        "treatment_ar": "ضع مبيدًا فطريًا أو خليطًا من صودا الخبز والماء والصابون. قم بإزالة الأجزاء المتضررة بشدة.",
        "prevention": "Improve air circulation. Avoid overhead watering. Plant resistant varieties.",
        "prevention_ar": "حسن دورة الهواء. تجنب الري العلوي. ازرع أصنافًا مقاومة."
    }
]

async def save_upload_file(upload_file: UploadFile, diagnosis_id: str) -> str:
    """Save an uploaded file to disk and return the file path"""
    # Create directory for this diagnosis
    diagnosis_dir = os.path.join(UPLOAD_DIR, diagnosis_id)
    os.makedirs(diagnosis_dir, exist_ok=True)
    
    # Generate file path
    file_extension = os.path.splitext(upload_file.filename)[1]
    file_name = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(diagnosis_dir, file_name)
    
    # Save file
    try:
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await upload_file.read()
            await out_file.write(content)
        
        return file_path
    except Exception as e:
        logger.error(f"Error saving file: {e}")
        raise e

async def diagnose_plant_image(image_path: str) -> Tuple[str, float, Dict[str, Any]]:
    """Diagnose plant disease from image
    
    In a real application, this would load the ML model and run inference.
    For now, we'll return mock results.
    
    Returns:
        Tuple containing condition_id, confidence score, and condition details
    """
    try:
        # In a real app, we would:
        # 1. Load the image and preprocess it
        # 2. Load the ML model
        # 3. Run inference
        # 4. Process results
        
        # For now, return a mock result
        import random
        condition = random.choice(MOCK_CONDITIONS)
        
        return condition["id"], condition["confidence"], condition
    except Exception as e:
        logger.error(f"Error diagnosing image: {e}")
        # Return healthy as fallback with low confidence
        return "healthy", 0.5, MOCK_CONDITIONS[0]

def get_condition_details(condition_id: str) -> Dict[str, Any]:
    """Get details for a specific plant condition"""
    for condition in MOCK_CONDITIONS:
        if condition["id"] == condition_id:
            return condition
    
    # Return healthy as fallback
    return MOCK_CONDITIONS[0]