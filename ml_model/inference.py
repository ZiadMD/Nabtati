import os
import numpy as np
import tensorflow as tf
import json
from PIL import Image
import io

# Configuration
IMAGE_SIZE = (224, 224)
MODEL_EXPORT_DIR = "model_export"
MODEL_PATH = os.path.join(MODEL_EXPORT_DIR, "plant_disease_model.h5")
CLASS_MAPPING_PATH = os.path.join(MODEL_EXPORT_DIR, "class_mapping.json")

# Plant condition details (for development/testing)
CONDITION_DETAILS = {
    "healthy": {
        "name": "Healthy",
        "name_ar": "صحي",
        "description": "The plant appears to be healthy with no visible signs of disease or pest infestation.",
        "description_ar": "النبات يبدو صحيًا بدون علامات مرئية للمرض أو إصابة الآفات.",
        "treatment": "No treatment needed. Continue with regular care.",
        "treatment_ar": "لا يحتاج إلى علاج. استمر في الرعاية المنتظمة.",
        "prevention": "Maintain regular watering, appropriate light, and occasional fertilizing.",
        "prevention_ar": "حافظ على الري المنتظم، والضوء المناسب، والتسميد العرضي."
    },
    "leaf_spot": {
        "name": "Leaf Spot Disease",
        "name_ar": "مرض تبقع الأوراق",
        "description": "Leaf spot is a common plant disease characterized by brown or black spots on leaves.",
        "description_ar": "تبقع الأوراق هو مرض نباتي شائع يتميز ببقع بنية أو سوداء على الأوراق.",
        "treatment": "Remove affected leaves. Apply fungicide if severe. Ensure good air circulation.",
        "treatment_ar": "قم بإزالة الأوراق المصابة. ضع مبيدًا فطريًا إذا كان شديدًا. تأكد من وجود دورة هوائية جيدة.",
        "prevention": "Avoid overhead watering. Space plants properly. Keep garden clean of debris.",
        "prevention_ar": "تجنب الري العلوي. ضع النباتات بشكل صحيح. حافظ على نظافة الحديقة من البقايا."
    },
    "powdery_mildew": {
        "name": "Powdery Mildew",
        "name_ar": "البياض الدقيقي",
        "description": "Powdery mildew appears as white powdery spots on leaves and stems.",
        "description_ar": "يظهر البياض الدقيقي كبقع بيضاء مسحوقية على الأوراق والسيقان.",
        "treatment": "Apply fungicide or a mixture of baking soda, water, and soap. Remove severely affected parts.",
        "treatment_ar": "ضع مبيدًا فطريًا أو خليطًا من صودا الخبز والماء والصابون. قم بإزالة الأجزاء المتضررة بشدة.",
        "prevention": "Improve air circulation. Avoid overhead watering. Plant resistant varieties.",
        "prevention_ar": "حسن دورة الهواء. تجنب الري العلوي. ازرع أصنافًا مقاومة."
    }
}

class PlantDiseaseClassifier:
    """Class for plant disease classification using a trained model"""
    
    def __init__(self):
        """Initialize the classifier"""
        self.model = None
        self.class_mapping = None
        self.class_names = None
        self.loaded = False
    
    def load_model(self):
        """Load the trained model and class mapping"""
        try:
            # Check if model file exists
            if not os.path.exists(MODEL_PATH):
                print(f"Error: Model file '{MODEL_PATH}' not found.")
                return False
            
            # Load the model
            self.model = tf.keras.models.load_model(MODEL_PATH)
            
            # Check if class mapping file exists
            if not os.path.exists(CLASS_MAPPING_PATH):
                print(f"Error: Class mapping file '{CLASS_MAPPING_PATH}' not found.")
                return False
            
            # Load class mapping
            with open(CLASS_MAPPING_PATH, "r") as f:
                self.class_mapping = json.load(f)
            
            # Invert the class mapping
            self.class_names = {v: k for k, v in self.class_mapping.items()}
            
            self.loaded = True
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
    
    def preprocess_image(self, image):
        """Preprocess an image for prediction
        
        Args:
            image: PIL Image or path to image file
            
        Returns:
            Preprocessed image array
        """
        # If image is a file path, load it
        if isinstance(image, str):
            image = Image.open(image)
        
        # Resize image
        image = image.resize(IMAGE_SIZE)
        
        # Convert to array and normalize
        img_array = np.array(image)
        img_array = img_array / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    
    def predict(self, image):
        """Predict the disease class for an image
        
        Args:
            image: PIL Image, path to image file, or bytes
            
        Returns:
            Dictionary with prediction results
        """
        # Load model if not already loaded
        if not self.loaded and not self.load_model():
            return {
                "error": "Failed to load model",
                "class": "unknown",
                "confidence": 0.0
            }
        
        try:
            # If image is bytes, convert to PIL Image
            if isinstance(image, bytes):
                image = Image.open(io.BytesIO(image))
            
            # Preprocess the image
            img_array = self.preprocess_image(image)
            
            # Make prediction
            predictions = self.model.predict(img_array)
            predicted_class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_class_idx])
            
            # Get class name
            predicted_class = self.class_names[predicted_class_idx]
            
            # Get condition details
            condition_details = CONDITION_DETAILS.get(predicted_class, {
                "name": predicted_class.replace("_", " ").title(),
                "description": "No detailed information available for this condition."
            })
            
            return {
                "class": predicted_class,
                "confidence": confidence,
                "details": condition_details,
                "predictions": {self.class_names[i]: float(predictions[0][i]) for i in range(len(predictions[0]))}
            }
        except Exception as e:
            print(f"Error during prediction: {e}")
            return {
                "error": str(e),
                "class": "unknown",
                "confidence": 0.0
            }

# Create a singleton instance
classifier = PlantDiseaseClassifier()

def predict_image(image_path):
    """Predict the disease class for a single image
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Dictionary with prediction results
    """
    return classifier.predict(image_path)

def predict_image_bytes(image_bytes):
    """Predict the disease class for image bytes
    
    Args:
        image_bytes: Image data as bytes
        
    Returns:
        Dictionary with prediction results
    """
    return classifier.predict(image_bytes)

# For testing
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python inference.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    if not os.path.exists(image_path):
        print(f"Error: Image file '{image_path}' not found.")
        sys.exit(1)
    
    result = predict_image(image_path)
    print(json.dumps(result, indent=2))