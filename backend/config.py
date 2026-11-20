
from pathlib import Path

# Project directory
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Model directory
MODEL_DIR = PROJECT_ROOT / "models"

# Saved calibrated model
MODEL_PATH = MODEL_DIR / "random_forest_calibrated.pkl"

# Model configuration
MODEL_CONFIG_PATH = MODEL_DIR / "calibrated_model_config.json"



# Risk classification thresholds
VERY_LOW_RISK_THRESHOLD = 0.20
LOW_RISK_THRESHOLD = 0.40
MEDIUM_RISK_THRESHOLD = 0.60
HIGH_RISK_THRESHOLD = 0.80


def get_risk_category(probability):

    if probability < VERY_LOW_RISK_THRESHOLD:
        return "Very Low Risk"

    elif probability < LOW_RISK_THRESHOLD:
        return "Low Risk"

    elif probability < MEDIUM_RISK_THRESHOLD:
        return "Medium Risk"

    elif probability < HIGH_RISK_THRESHOLD:
        return "High Risk"

    else:
        return "Very High Risk"
