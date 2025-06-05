from typing import Dict, Any, Optional
from fastapi import Request

# Default language
DEFAULT_LANGUAGE = "en"

# Supported languages
SUPPORTED_LANGUAGES = ["en", "ar"]

def get_language_from_request(request: Request) -> str:
    """Extract the preferred language from the request
    
    Checks the Accept-Language header and falls back to DEFAULT_LANGUAGE
    
    Args:
        request: The FastAPI request object
        
    Returns:
        The language code (e.g., 'en', 'ar')
    """
    # Get Accept-Language header
    accept_language = request.headers.get("Accept-Language", DEFAULT_LANGUAGE)
    
    # Parse the header to get the preferred language
    # Format is typically like: en-US,en;q=0.9,ar;q=0.8
    languages = []
    for lang_q in accept_language.split(","):
        parts = lang_q.strip().split(";", 1)
        lang = parts[0].split("-")[0]  # Get the main language part (e.g., 'en' from 'en-US')
        
        # Check if the language is supported
        if lang in SUPPORTED_LANGUAGES:
            languages.append(lang)
    
    # Return the first supported language or the default
    return languages[0] if languages else DEFAULT_LANGUAGE

def get_localized_field(obj: Dict[str, Any], field: str, language: str) -> Any:
    """Get a localized field from an object
    
    Args:
        obj: The object containing the fields
        field: The base field name (e.g., 'name')
        language: The language code (e.g., 'en', 'ar')
        
    Returns:
        The localized field value or the default field value
    """
    # For non-default languages, try to get the localized field
    if language != DEFAULT_LANGUAGE:
        localized_field = f"{field}_{language}"
        if localized_field in obj and obj[localized_field]:
            return obj[localized_field]
    
    # Fall back to the default field
    return obj.get(field)

def localize_object(obj: Dict[str, Any], language: str) -> Dict[str, Any]:
    """Localize an object by replacing fields with their localized versions
    
    Args:
        obj: The object to localize
        language: The language code (e.g., 'en', 'ar')
        
    Returns:
        A new object with localized fields
    """
    # If it's the default language or not a dictionary, return as is
    if language == DEFAULT_LANGUAGE or not isinstance(obj, dict):
        return obj
    
    # Create a new object with localized fields
    localized_obj = {}
    for key, value in obj.items():
        # Skip fields that end with a language code
        if any(key.endswith(f"_{lang}") for lang in SUPPORTED_LANGUAGES):
            continue
        
        # Check if there's a localized version of this field
        localized_key = f"{key}_{language}"
        if localized_key in obj and obj[localized_key]:
            localized_obj[key] = obj[localized_key]
        else:
            # If it's a nested dictionary, localize it recursively
            if isinstance(value, dict):
                localized_obj[key] = localize_object(value, language)
            # If it's a list of dictionaries, localize each item
            elif isinstance(value, list) and all(isinstance(item, dict) for item in value):
                localized_obj[key] = [localize_object(item, language) for item in value]
            else:
                localized_obj[key] = value
    
    return localized_obj