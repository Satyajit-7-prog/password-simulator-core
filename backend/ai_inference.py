import joblib
import pandas as pd
import os

# 1. Find the brain file
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'password_ai_model.pkl')

# 2. Load the AI model
try:
    ai_model = joblib.load(MODEL_PATH)
except Exception as e:
    ai_model = None
    print(f"Error loading AI model: {e}")

# 3. Extract the exact same features we used during training!
def extract_features(pwd):
    return {
        'length': len(pwd),
        'num_digits': sum(c.isdigit() for c in pwd),
        'num_upper': sum(c.isupper() for c in pwd),
        'num_special': sum(not c.isalnum() for c in pwd)
    }

def predict_password_strength(password):
    if not ai_model:
        return {"error": "AI Model not found!"}
    
    features = extract_features(password)
    
    # Convert to the format the AI expects
    df_features = pd.DataFrame([features])
    
    # Ask the AI for a prediction
    prediction = ai_model.predict(df_features)[0]
    
    labels = {0: "Terrible", 1: "Weak", 2: "Fair", 3: "Strong", 4: "Unbreakable"}
    
    # --- NEW: Build the Educational Reason! ---
    contains = []
    missing = []
    
    if features['num_upper'] > 0: contains.append("uppercase")
    else: missing.append("uppercase")
        
    if features['num_digits'] > 0: contains.append("digits")
    else: missing.append("digits")
        
    if features['num_special'] > 0: contains.append("symbols")
    else: missing.append("symbols")
    
    # Write a clean English sentence explaining the stats
    reason = f"Password length is {features['length']}. "
    if contains:
        reason += f"It contains {', '.join(contains)}. "
    if missing:
        reason += f"It is missing {', '.join(missing)}. "
    # ----------------------------------------
    
    return {
        "ai_score": int(prediction),
        "ai_label": labels.get(int(prediction), "Unknown"),
        "educational_reason": reason.strip(), # <-- Sent to the frontend!
        "features_analyzed": features
    }