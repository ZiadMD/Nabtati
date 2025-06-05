# Hadeeqati Plant Disease Classification Model

This directory contains the machine learning model for plant disease classification used in the Hadeeqati app.

## Overview

The model is built using TensorFlow and Keras, with a MobileNetV2 architecture pre-trained on ImageNet and fine-tuned on plant disease images. It can classify various plant diseases from images.

## Directory Structure

```
ml_model/
├── data/                  # Training data directory (not included in repo)
│   ├── healthy/           # Images of healthy plants
│   ├── leaf_spot/         # Images of plants with leaf spot disease
│   └── powdery_mildew/    # Images of plants with powdery mildew
├── model_export/          # Exported model files
│   ├── plant_disease_model.h5  # Trained model
│   ├── class_mapping.json      # Class name mapping
│   └── training_history.png    # Training history plot
├── train_model.py         # Script for training the model
├── inference.py           # Script for making predictions
└── README.md              # This file
```

## Setup

1. Install the required dependencies:

```bash
pip install tensorflow numpy pillow matplotlib scikit-learn
```

2. Prepare your dataset:
   - Create a `data` directory
   - Inside `data`, create subdirectories for each plant disease class
   - Place corresponding images in each class directory

Example structure:
```
data/
├── healthy/
│   ├── img001.jpg
│   └── img002.jpg
├── leaf_spot/
│   ├── img003.jpg
│   └── img004.jpg
└── powdery_mildew/
    ├── img005.jpg
    └── img006.jpg
```

## Training the Model

To train the model, run:

```bash
python train_model.py
```

This will:
1. Load and preprocess the training data
2. Create a model based on MobileNetV2
3. Train the model on your dataset
4. Save the trained model to `model_export/plant_disease_model.h5`
5. Save the class mapping to `model_export/class_mapping.json`
6. Generate a training history plot

## Making Predictions

To test the model on a single image, run:

```bash
python inference.py path/to/your/image.jpg
```

This will output a JSON with the prediction results, including:
- The predicted class
- Confidence score
- Detailed information about the condition
- All class probabilities

## Integration with Backend

The backend uses the `inference.py` script to make predictions. The main functions are:

- `predict_image(image_path)`: Predict from an image file path
- `predict_image_bytes(image_bytes)`: Predict from image bytes (useful for API uploads)

## Customizing the Model

You can customize the model by modifying the following parameters in `train_model.py`:

- `BATCH_SIZE`: Batch size for training
- `IMAGE_SIZE`: Input image dimensions
- `EPOCHS`: Number of training epochs
- `LEARNING_RATE`: Learning rate for the optimizer

## Adding New Classes

To add new plant disease classes:

1. Create a new subdirectory in the `data` directory for the new class
2. Add images to the new directory
3. Retrain the model by running `train_model.py`

## Model Performance

The model's performance depends on the quality and quantity of your training data. For best results:

- Use at least 100 images per class
- Ensure images are clear and focused on the plant/disease
- Include a variety of lighting conditions and angles
- Balance the number of images across classes

## Troubleshooting

If you encounter issues:

- Check that your images are in a supported format (JPEG, PNG)
- Ensure your directory structure matches the expected format
- Verify that you have sufficient training data
- Check the console output for specific error messages