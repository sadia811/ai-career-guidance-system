import os
import joblib
import pandas as pd
from preprocessing import train_model

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "career_prediction_min_dataset.xlsx")
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")
MODEL_PATH = os.path.join(ARTIFACTS_DIR, "career_model.joblib")
ARTIFACTS_PATH = os.path.join(ARTIFACTS_DIR, "preprocessing_artifacts.joblib")

os.makedirs(ARTIFACTS_DIR, exist_ok=True)

def main():
    df = pd.read_excel(DATA_PATH)

    model, artifacts, metrics = train_model(df)

    joblib.dump(model, MODEL_PATH)
    joblib.dump(artifacts, ARTIFACTS_PATH)

    print("Model training completed.")
    print(f"Model saved to: {MODEL_PATH}")
    print(f"Artifacts saved to: {ARTIFACTS_PATH}")
    print(f"Accuracy: {metrics['accuracy']:.4f}")
    print("\nClassification Report:\n")
    print(metrics["classification_report"])

if __name__ == "__main__":
    main()