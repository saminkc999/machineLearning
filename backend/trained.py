# 1. TRAINING SCRIPT: train_models.py
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder

# Load dataset
df = pd.read_csv("metadata.csv")

# Replace 'Diagnosis' with actual label column when available
target_column = 'expert1_grade'  # Example: change if needed

# Drop rows with missing target or too many missing values
df = df.dropna(subset=[target_column])

# Select numeric features only
features = df.select_dtypes(include=['float64', 'int64']).drop(columns=[target_column], errors='ignore')
X = features.fillna(0)  # or use df.dropna()
y = df[target_column]

# Encode labels if they are not numeric
if y.dtype == 'object':
    le = LabelEncoder()
    y = le.fit_transform(y)
    joblib.dump(le, 'label_encoder.pkl')

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest
rf_model = RandomForestClassifier()
rf_model.fit(X_train, y_train)
joblib.dump(rf_model, 'random_forest_model.pkl')

# Train SVM
svm_model = SVC(probability=True)
svm_model.fit(X_train, y_train)
joblib.dump(svm_model, 'svm_model.pkl')

print("Models trained and saved.")
