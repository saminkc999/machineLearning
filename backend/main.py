from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import joblib

app = FastAPI()

# Allow frontend to communicate with backend (CORS setup)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
try:
    model = joblib.load("random_forest_model.pkl")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Input format
class GlaucomaFeatures(BaseModel):
    features: list[float]  # Expected number of features

@app.post("/predict")
def predict(features: GlaucomaFeatures):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    # Adjust feature count if necessary (e.g., 24)
    expected_features = 24
    if len(features.features) != expected_features:
        raise HTTPException(
            status_code=400,
            detail=f"Expected {expected_features} features, got {len(features.features)}"
        )

    try:
        X = np.array(features.features).reshape(1, -1)
        prediction = model.predict(X)[0]

        result = "Glaucoma" if prediction == 1 else "Not Glaucoma"
        return {"prediction": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")
