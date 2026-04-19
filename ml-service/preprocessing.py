import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer


LIST_COLUMNS = [
    "technical_skills",
    "soft_skills",
    "career_interests",
    "experience_tags",
]

TEXT_COLUMN = "experience_text"


def split_list_field(value):
    if value is None:
        return []
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    return [item.strip() for item in str(value).split(",") if item.strip()]


def normalize_profile_input(profile):
    return {
        "degree": str(profile.get("degree", "")).strip(),
        "major": str(profile.get("major", "")).strip(),
        "technical_skills": split_list_field(profile.get("technicalSkills", profile.get("technical_skills", []))),
        "soft_skills": split_list_field(profile.get("softSkills", profile.get("soft_skills", []))),
        "career_interests": split_list_field(profile.get("careerInterests", profile.get("career_interests", []))),
        "experience_tags": split_list_field(profile.get("experienceTags", profile.get("experience_tags", []))),
        "experience_text": str(profile.get("experienceText", profile.get("experience_text", ""))).strip(),
    }


def prepare_dataframe(df):
    prepared = df.copy()

    prepared["degree"] = prepared["degree"].fillna("").astype(str).str.strip()
    prepared["major"] = prepared["major"].fillna("").astype(str).str.strip()

    for col in LIST_COLUMNS:
        prepared[col] = prepared[col].apply(split_list_field)

    prepared[TEXT_COLUMN] = prepared[TEXT_COLUMN].fillna("").astype(str).str.strip()
    return prepared


def fit_artifacts(df):
    df = prepare_dataframe(df)

    degree_categories = sorted(df["degree"].unique().tolist())
    major_categories = sorted(df["major"].unique().tolist())

    list_binarizers = {}
    for col in LIST_COLUMNS:
        mlb = MultiLabelBinarizer()
        mlb.fit(df[col])
        list_binarizers[col] = mlb

    text_vectorizer = TfidfVectorizer(max_features=50, stop_words="english")
    text_vectorizer.fit(df[TEXT_COLUMN])

    label_encoder = LabelEncoder()
    label_encoder.fit(df["target_career"])

    return {
        "degree_categories": degree_categories,
        "major_categories": major_categories,
        "list_binarizers": list_binarizers,
        "text_vectorizer": text_vectorizer,
        "label_encoder": label_encoder,
    }


def transform_profiles(records, artifacts):
    rows = []
    for profile in records:
        normalized = normalize_profile_input(profile)
        rows.append(normalized)

    df = pd.DataFrame(rows)
    df = prepare_dataframe(df)

    degree_features = pd.get_dummies(df["degree"], prefix="degree")
    expected_degree_cols = [f"degree_{value}" for value in artifacts["degree_categories"]]
    degree_features = degree_features.reindex(columns=expected_degree_cols, fill_value=0)

    major_features = pd.get_dummies(df["major"], prefix="major")
    expected_major_cols = [f"major_{value}" for value in artifacts["major_categories"]]
    major_features = major_features.reindex(columns=expected_major_cols, fill_value=0)

    list_feature_frames = []
    for col in LIST_COLUMNS:
        mlb = artifacts["list_binarizers"][col]
        transformed = mlb.transform(df[col])
        feature_names = [f"{col}_{label}" for label in mlb.classes_]
        list_feature_frames.append(pd.DataFrame(transformed, columns=feature_names))

    text_vectorizer = artifacts["text_vectorizer"]
    text_matrix = text_vectorizer.transform(df[TEXT_COLUMN]).toarray()
    text_feature_names = [f"text_{name}" for name in text_vectorizer.get_feature_names_out()]
    text_features = pd.DataFrame(text_matrix, columns=text_feature_names)

    full_features = pd.concat(
        [degree_features, major_features, *list_feature_frames, text_features],
        axis=1,
    )

    return full_features.values, full_features.columns.tolist()


def train_model(df):
    artifacts = fit_artifacts(df)
    X, feature_names = transform_profiles(df.to_dict(orient="records"), artifacts)

    y = artifacts["label_encoder"].transform(df["target_career"])

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    model = RandomForestClassifier(
        n_estimators=250,
        random_state=42,
        max_depth=12,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "classification_report": classification_report(
            y_test,
            y_pred,
            target_names=artifacts["label_encoder"].classes_,
            zero_division=0,
        ),
    }

    artifacts["feature_names"] = feature_names
    return model, artifacts, metrics


def predict_profile(model, artifacts, profile):
    X, _ = transform_profiles([profile], artifacts)

    predicted_index = model.predict(X)[0]
    predicted_label = artifacts["label_encoder"].inverse_transform([predicted_index])[0]

    probabilities = model.predict_proba(X)[0]
    classes = artifacts["label_encoder"].classes_

    ranked = sorted(
        [
            {
                "career": classes[i],
                "probability": round(float(probabilities[i]), 4),
            }
            for i in range(len(classes))
        ],
        key=lambda item: item["probability"],
        reverse=True,
    )

    return {
        "topCareer": predicted_label,
        "predictions": ranked[:3],
    }