# Hadeeqati (حديقتي) - Home Garden Care App

Hadeeqati is a bilingual (Arabic/English) home garden care application that helps users identify and solve common plant issues, track watering schedules, manage their plant collection, and purchase gardening supplies.

## Features

- **Plant Issue Diagnosis**: Identify plant problems using computer vision
- **Watering Reminders**: Get notifications when plants need watering
- **Plant Management**: Store and track all your plants in one place
- **Marketplace**: Purchase seeds, plants, and gardening supplies
- **Bilingual Support**: Full Arabic and English language support

## Project Structure

```
/hadeeqati-app
├─ /frontend                 # React Native mobile app
│   ├─ package.json
│   ├─ /src
│   │   ├─ /components       # Reusable UI components
│   │   ├─ /screens          # App screens
│   │   ├─ /assets           # Images, fonts, etc.
│   │   ├─ theme.js          # UI theme configuration
│   │   └─ App.js            # Main app component
├─ /backend                  # FastAPI backend
│   ├─ requirements.txt      # Python dependencies
│   ├─ /app
│   │   ├─ main.py          # FastAPI entry point
│   │   ├─ /models           # Pydantic schemas
│   │   ├─ /routers          # API endpoints
│   │   ├─ /services         # Business logic
│   │   └─ /utils            # Helper functions
├─ /ml_model                 # Computer vision model
│   ├─ train.py              # Model training script
│   ├─ /model_export         # Saved model files
│   └─ /data                 # Training data
└─ Dockerfile                # For containerization
```

## Technology Stack

### Frontend
- React Native (JavaScript/TypeScript)
- i18next for localization

### Backend
- Python 3.9+ with FastAPI
- PostgreSQL for database
- JWT for authentication

### Computer Vision
- TensorFlow 2.x / PyTorch
- MobileNetV2 or EfficientNetB0 architecture

### Deployment
- AWS Elastic Beanstalk / Heroku for backend
- AWS RDS / Heroku Postgres for database
- AWS S3 / Cloudinary for image storage
- Firebase Cloud Messaging for notifications

## Setup Instructions

### Prerequisites
- Node.js 14+
- Python 3.9+
- PostgreSQL
- AWS account (for production deployment)

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd hadeeqati-app/frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd hadeeqati-app/backend
   ```
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Set up environment variables (create a .env file)
5. Run the server:
   ```
   uvicorn app.main:app --reload
   ```

### ML Model Setup
1. Navigate to the ml_model directory:
   ```
   cd hadeeqati-app/ml_model
   ```
2. Install dependencies (if not already installed):
   ```
   pip install -r requirements.txt
   ```
3. Train the model (optional):
   ```
   python train.py
   ```

## Deployment

### Backend Deployment
1. Create an AWS Elastic Beanstalk environment
2. Configure environment variables
3. Deploy using the EB CLI or AWS Console

### Database Deployment
1. Create an AWS RDS PostgreSQL instance
2. Configure security groups and connection settings
3. Run migrations to set up the schema

### Frontend Deployment
1. Build the React Native app for iOS/Android
2. Distribute via TestFlight/Google Play Beta

## ML Model Training & Updating

1. Collect and label plant images (healthy and with various issues)
2. Preprocess images (resize to 224×224, normalize)
3. Train the model using train.py
4. Export the model to SavedModel or TorchScript format
5. Deploy the model to the backend service

## API Documentation

API documentation is available at `/docs` when the backend server is running.

## License

This project is proprietary and confidential.