import os
import joblib
from flask import Flask, jsonify, request
from preprocessing import predict_profile

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "artifacts", "career_model.joblib")
ARTIFACTS_PATH = os.path.join(BASE_DIR, "artifacts", "preprocessing_artifacts.joblib")

app = Flask(__name__)

model = joblib.load(MODEL_PATH)
artifacts = joblib.load(ARTIFACTS_PATH)

@app.get("/health")
def health():
    return jsonify({"status": "ok", "message": "ML service is running"})

@app.post("/predict")
def predict():
    try:
        payload = request.get_json()

        if not payload:
            return jsonify({"message": "Request body is required"}), 400

        result = predict_profile(model, artifacts, payload)
        return jsonify(result), 200

    except Exception as error:
        return jsonify({
            "message": "Prediction failed",
            "error": str(error),
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)