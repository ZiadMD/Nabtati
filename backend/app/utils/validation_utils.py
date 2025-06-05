from typing import Dict, Any, List, Union, Optional
from fastapi import HTTPException, status
from pydantic import ValidationError
import re

# Email validation regex
EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

# Password validation regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
PASSWORD_REGEX = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$'

def validate_email(email: str) -> bool:
    """Validate an email address format
    
    Args:
        email: The email address to validate
        
    Returns:
        True if valid, False otherwise
    """
    return bool(re.match(EMAIL_REGEX, email))

def validate_password(password: str) -> bool:
    """Validate a password meets security requirements
    
    Args:
        password: The password to validate
        
    Returns:
        True if valid, False otherwise
    """
    return bool(re.match(PASSWORD_REGEX, password))

def validate_phone_number(phone: str) -> bool:
    """Validate a phone number format
    
    Args:
        phone: The phone number to validate
        
    Returns:
        True if valid, False otherwise
    """
    # Basic validation - can be enhanced for specific country formats
    return bool(re.match(r'^\+?[0-9]{8,15}$', phone))

def format_validation_error(error: ValidationError) -> Dict[str, Any]:
    """Format a Pydantic validation error into a user-friendly response
    
    Args:
        error: The ValidationError object
        
    Returns:
        A dictionary with error details
    """
    errors = []
    for err in error.errors():
        errors.append({
            "field": err["loc"][0] if err["loc"] else None,
            "message": err["msg"]
        })
    
    return {
        "detail": "Validation error",
        "errors": errors
    }

def raise_validation_error(field: str, message: str):
    """Raise an HTTP validation error
    
    Args:
        field: The field with the error
        message: The error message
        
    Raises:
        HTTPException: With validation error details
    """
    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail={
            "detail": "Validation error",
            "errors": [
                {
                    "field": field,
                    "message": message
                }
            ]
        }
    )

def validate_required_fields(data: Dict[str, Any], required_fields: List[str]):
    """Validate that all required fields are present and not empty
    
    Args:
        data: The data dictionary to validate
        required_fields: List of required field names
        
    Raises:
        HTTPException: If any required field is missing or empty
    """
    for field in required_fields:
        if field not in data or data[field] is None or (isinstance(data[field], str) and not data[field].strip()):
            raise_validation_error(field, f"{field} is required")

def validate_string_length(value: str, field: str, min_length: Optional[int] = None, max_length: Optional[int] = None):
    """Validate a string's length
    
    Args:
        value: The string to validate
        field: The field name for error messages
        min_length: Minimum allowed length (optional)
        max_length: Maximum allowed length (optional)
        
    Raises:
        HTTPException: If validation fails
    """
    if min_length is not None and len(value) < min_length:
        raise_validation_error(field, f"{field} must be at least {min_length} characters")
    
    if max_length is not None and len(value) > max_length:
        raise_validation_error(field, f"{field} must be at most {max_length} characters")

def validate_numeric_range(value: Union[int, float], field: str, min_value: Optional[Union[int, float]] = None, max_value: Optional[Union[int, float]] = None):
    """Validate a numeric value is within a range
    
    Args:
        value: The numeric value to validate
        field: The field name for error messages
        min_value: Minimum allowed value (optional)
        max_value: Maximum allowed value (optional)
        
    Raises:
        HTTPException: If validation fails
    """
    if min_value is not None and value < min_value:
        raise_validation_error(field, f"{field} must be at least {min_value}")
    
    if max_value is not None and value > max_value:
        raise_validation_error(field, f"{field} must be at most {max_value}")