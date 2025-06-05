from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List, Optional
import uvicorn
import os

# Import routers
from routers import users, plants, diagnoses, marketplace

# Create FastAPI app
app = FastAPI(
    title="Hadeeqati API",
    description="Backend API for Hadeeqati - The Bilingual Home Garden Care App",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:19006",  # Expo web
    "exp://localhost:19000",   # Expo on device
    "*"  # For development - remove in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(plants.router, prefix="/api/plants", tags=["plants"])
app.include_router(diagnoses.router, prefix="/api/diagnoses", tags=["diagnoses"])
app.include_router(marketplace.router, prefix="/api/marketplace", tags=["marketplace"])

# Root endpoint
@app.get("/", tags=["root"])
async def read_root():
    return {
        "message": "Welcome to Hadeeqati API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    # Get port from environment variable or use default
    port = int(os.environ.get("PORT", 8000))
    
    # Run the application
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)