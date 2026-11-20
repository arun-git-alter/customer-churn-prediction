
import pandas as pd

from backend.config import get_risk_category
from backend.validator import FEATURE_ORDER


def predict_customer(customer_data, model):

    # Arrange customer data in the exact model feature order
    customer_df = pd.DataFrame(
        [customer_data],
        columns=FEATURE_ORDER
    )

    # Find the index of the positive class (Yes)
    classes = list(model.classes_)

    if "Yes" not in classes:
        raise ValueError("Model does not contain the positive class 'Yes'.")

    positive_class_index = classes.index("Yes")

    # Calculate churn probability
    probability = model.predict_proba(customer_df)[0][positive_class_index]

    # Apply the binary classification threshold
    churn_prediction = 1 if probability >= 0.50 else 0

    # Assign risk category
    risk_category = get_risk_category(probability)

    return {
        "churn_probability": round(float(probability), 4),
        "churn_prediction": churn_prediction,
        "churn_label": "Yes" if churn_prediction == 1 else "No",
        "risk_category": risk_category
    }
