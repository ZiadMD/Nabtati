import os
import uuid
from fastapi import UploadFile
import aiofiles
import logging
from typing import Optional

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Base upload directory
BASE_UPLOAD_DIR = "uploads"

# Ensure base upload directory exists
os.makedirs(BASE_UPLOAD_DIR, exist_ok=True)

async def save_upload_file(upload_file: UploadFile, directory: str, filename: Optional[str] = None) -> str:
    """Save an uploaded file to disk and return the file path
    
    Args:
        upload_file: The uploaded file
        directory: Subdirectory under BASE_UPLOAD_DIR to save the file in
        filename: Optional filename to use, if None a UUID will be generated
        
    Returns:
        The relative path to the saved file
    """
    # Create full directory path
    full_dir = os.path.join(BASE_UPLOAD_DIR, directory)
    os.makedirs(full_dir, exist_ok=True)
    
    # Generate filename if not provided
    if not filename:
        file_extension = os.path.splitext(upload_file.filename)[1]
        filename = f"{uuid.uuid4()}{file_extension}"
    
    # Full file path
    file_path = os.path.join(full_dir, filename)
    
    # Save file
    try:
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await upload_file.read()
            await out_file.write(content)
        
        # Return relative path from BASE_UPLOAD_DIR
        return os.path.join(directory, filename)
    except Exception as e:
        logger.error(f"Error saving file: {e}")
        raise e

def get_file_extension(filename: str) -> str:
    """Get the file extension from a filename"""
    return os.path.splitext(filename)[1].lower()

def is_valid_image(filename: str) -> bool:
    """Check if a file is a valid image based on its extension"""
    valid_extensions = [".jpg", ".jpeg", ".png", ".gif"]
    return get_file_extension(filename) in valid_extensions

def get_file_url(relative_path: str) -> str:
    """Convert a relative file path to a URL"""
    # In a real app, this would prepend the base URL of your file server
    # For now, we'll just prepend a slash
    return f"/{relative_path}"