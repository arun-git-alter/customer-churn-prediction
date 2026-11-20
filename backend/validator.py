
import math


# Categorical feature validation
CATEGORICAL_FEATURES = {
    "gender": ["Female", "Male"],

    "Partner": ["No", "Yes"],
    "Dependents": ["No", "Yes"],

    "PhoneService": ["No", "Yes"],

    "MultipleLines": [
        "No",
        "Yes",
        "No phone service"
    ],

    "InternetService": [
        "DSL",
        "Fiber optic",
        "No"
    ],

    "OnlineSecurity": [
        "No",
        "Yes",
        "No internet service"
    ],

    "OnlineBackup": [
        "No",
        "Yes",
        "No internet service"
    ],

    "DeviceProtection": [
        "No",
        "Yes",
        "No internet service"
    ],

    "TechSupport": [
        "No",
        "Yes",
        "No internet service"
    ],

    "StreamingTV": [
        "No",
        "Yes",
        "No internet service"
    ],

    "StreamingMovies": [
        "No",
        "Yes",
        "No internet service"
    ],

    "Contract": [
        "Month-to-month",
        "One year",
        "Two year"
    ],

    "PaperlessBilling": ["No", "Yes"],

    "PaymentMethod": [
        "Bank transfer (automatic)",
        "Credit card (automatic)",
        "Electronic check",
        "Mailed check"
    ]
}


# Numerical feature validation
NUMERICAL_FEATURES = [
    "SeniorCitizen",
    "tenure",
    "MonthlyCharges",
    "TotalCharges"
]


# Exact feature order from the cleaned dataset
FEATURE_ORDER = [
    "gender",
    "SeniorCitizen",
    "Partner",
    "Dependents",
    "tenure",
    "PhoneService",
    "MultipleLines",
    "InternetService",
    "OnlineSecurity",
    "OnlineBackup",
    "DeviceProtection",
    "TechSupport",
    "StreamingTV",
    "StreamingMovies",
    "Contract",
    "PaperlessBilling",
    "PaymentMethod",
    "MonthlyCharges",
    "TotalCharges"
]


def validate_customer_data(data):

    if not isinstance(data, dict):
        raise ValueError("Customer data must be a JSON object.")

    # Check missing features
    missing_features = [
        feature for feature in FEATURE_ORDER
        if feature not in data
    ]

    if missing_features:
        raise ValueError(
            f"Missing required features: {missing_features}"
        )

    # Check unexpected features
    unexpected_features = [
        feature for feature in data
        if feature not in FEATURE_ORDER
    ]

    if unexpected_features:
        raise ValueError(
            f"Unexpected features: {unexpected_features}"
        )

    validated_data = {}

    # Validate categorical features
    for feature, allowed_values in CATEGORICAL_FEATURES.items():

        value = data[feature]

        if not isinstance(value, str):
            raise ValueError(
                f"{feature} must be a text value."
            )

        value = value.strip()

        if value not in allowed_values:
            raise ValueError(
                f"Invalid value for {feature}: {value}"
            )

        validated_data[feature] = value

    # Validate numerical features
    for feature in NUMERICAL_FEATURES:

        value = data[feature]

        if value is None or isinstance(value, bool):
            raise ValueError(
                f"{feature} must be a valid number."
            )

        try:
            value = float(value)
        except (ValueError, TypeError):
            raise ValueError(
                f"{feature} must be a valid number."
            )

        if not math.isfinite(value):
            raise ValueError(
                f"{feature} must be a finite number."
            )

        if feature == "SeniorCitizen":
            if value not in (0, 1):
                raise ValueError(
                    "SeniorCitizen must be 0 or 1."
                )

        elif feature == "tenure":
            if not value.is_integer() or not 1 <= value <= 72:
                raise ValueError(
                    "tenure must be an integer between 0 and 72."
                )

            value = int(value)

        elif value < 0:
            raise ValueError(
                f"{feature} cannot be negative."
            )

        validated_data[feature] = value

    # Return features in the exact model input order
    return {
        feature: validated_data[feature]
        for feature in FEATURE_ORDER
    }
