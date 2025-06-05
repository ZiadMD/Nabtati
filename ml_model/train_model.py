import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models, optimizers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import json
import matplotlib.pyplot as plt

# Configuration
BATCH_SIZE = 32
IMAGE_SIZE = (224, 224)
EPOCHS = 10
LEARNING_RATE = 0.0001
DATA_DIR = "data"
MODEL_EXPORT_DIR = "model_export"

# Ensure export directory exists
os.makedirs(MODEL_EXPORT_DIR, exist_ok=True)

def create_model(num_classes):
    """Create a transfer learning model based on MobileNetV2"""
    # Load the pre-trained model
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(*IMAGE_SIZE, 3)
    )
    
    # Freeze the base model
    base_model.trainable = False
    
    # Create new model on top
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    # Compile the model
    model.compile(
        optimizer=optimizers.Adam(learning_rate=LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def train_model():
    """Train the plant disease classification model"""
    print("Starting model training...")
    
    # Check if data directory exists
    if not os.path.exists(DATA_DIR):
        print(f"Error: Data directory '{DATA_DIR}' not found.")
        print("Please download and prepare the dataset first.")
        return
    
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2
    )
    
    # Load training data
    train_generator = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )
    
    # Load validation data
    validation_generator = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )
    
    # Get number of classes
    num_classes = len(train_generator.class_indices)
    print(f"Number of classes: {num_classes}")
    
    # Create and train the model
    model = create_model(num_classes)
    
    # Train the model
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // BATCH_SIZE,
        epochs=EPOCHS,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // BATCH_SIZE
    )
    
    # Save the model
    model.save(os.path.join(MODEL_EXPORT_DIR, "plant_disease_model.h5"))
    
    # Save class indices
    with open(os.path.join(MODEL_EXPORT_DIR, "class_mapping.json"), "w") as f:
        json.dump(train_generator.class_indices, f)
    
    # Plot training history
    plot_training_history(history)
    
    print("Model training completed and saved successfully!")
    return model, history

def plot_training_history(history):
    """Plot training and validation accuracy/loss"""
    # Accuracy plot
    plt.figure(figsize=(12, 4))
    
    plt.subplot(1, 2, 1)
    plt.plot(history.history['accuracy'])
    plt.plot(history.history['val_accuracy'])
    plt.title('Model Accuracy')
    plt.ylabel('Accuracy')
    plt.xlabel('Epoch')
    plt.legend(['Train', 'Validation'], loc='upper left')
    
    # Loss plot
    plt.subplot(1, 2, 2)
    plt.plot(history.history['loss'])
    plt.plot(history.history['val_loss'])
    plt.title('Model Loss')
    plt.ylabel('Loss')
    plt.xlabel('Epoch')
    plt.legend(['Train', 'Validation'], loc='upper left')
    
    plt.tight_layout()
    plt.savefig(os.path.join(MODEL_EXPORT_DIR, "training_history.png"))

def evaluate_model(model, test_data_dir):
    """Evaluate the model on test data"""
    test_datagen = ImageDataGenerator(rescale=1./255)
    
    test_generator = test_datagen.flow_from_directory(
        test_data_dir,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        shuffle=False
    )
    
    # Evaluate the model
    results = model.evaluate(test_generator)
    print(f"Test Loss: {results[0]}")
    print(f"Test Accuracy: {results[1]}")
    
    # Get predictions
    predictions = model.predict(test_generator)
    predicted_classes = np.argmax(predictions, axis=1)
    
    # Get true classes
    true_classes = test_generator.classes
    
    # Calculate confusion matrix
    from sklearn.metrics import confusion_matrix, classification_report
    cm = confusion_matrix(true_classes, predicted_classes)
    
    # Print classification report
    class_names = list(test_generator.class_indices.keys())
    report = classification_report(true_classes, predicted_classes, target_names=class_names)
    print("Classification Report:")
    print(report)
    
    return results, cm, report

def predict_image(image_path, model=None, class_mapping=None):
    """Predict the disease class for a single image"""
    # Load model if not provided
    if model is None:
        model_path = os.path.join(MODEL_EXPORT_DIR, "plant_disease_model.h5")
        if not os.path.exists(model_path):
            print(f"Error: Model file '{model_path}' not found.")
            return None
        model = tf.keras.models.load_model(model_path)
    
    # Load class mapping if not provided
    if class_mapping is None:
        mapping_path = os.path.join(MODEL_EXPORT_DIR, "class_mapping.json")
        if not os.path.exists(mapping_path):
            print(f"Error: Class mapping file '{mapping_path}' not found.")
            return None
        with open(mapping_path, "r") as f:
            class_mapping = json.load(f)
    
    # Invert the class mapping
    class_names = {v: k for k, v in class_mapping.items()}
    
    # Load and preprocess the image
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=IMAGE_SIZE)
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    
    # Make prediction
    predictions = model.predict(img_array)
    predicted_class_idx = np.argmax(predictions[0])
    confidence = predictions[0][predicted_class_idx]
    
    # Get class name
    predicted_class = class_names[predicted_class_idx]
    
    return {
        "class": predicted_class,
        "confidence": float(confidence),
        "predictions": {class_names[i]: float(predictions[0][i]) for i in range(len(predictions[0]))}
    }

if __name__ == "__main__":
    # If data directory doesn't exist, print instructions
    if not os.path.exists(DATA_DIR):
        print(f"Data directory '{DATA_DIR}' not found.")
        print("\nTo train the model, please:")
        print("1. Create a 'data' directory")
        print("2. Inside 'data', create subdirectories for each plant disease class")
        print("3. Place corresponding images in each class directory")
        print("\nExample structure:")
        print("data/")
        print("├── healthy/")
        print("│   ├── img001.jpg")
        print("│   └── img002.jpg")
        print("├── leaf_spot/")
        print("│   ├── img003.jpg")
        print("│   └── img004.jpg")
        print("└── powdery_mildew/")
        print("    ├── img005.jpg")
        print("    └── img006.jpg")
    else:
        # Train the model
        train_model()