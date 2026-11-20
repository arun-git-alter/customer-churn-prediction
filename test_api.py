
import requests

url = "http://127.0.0.1:5000/predict"

# Test 1: Missing required feature
missing_data = {
    "gender": "Male",
    "SeniorCitizen": 0,
    "Partner": "Yes"
}

# Test 2: Invalid category
invalid_data = {
    "gender": "Unknown",
    "SeniorCitizen": 0,
    "Partner": "Yes",
    "Dependents": "No",
    "tenure": 12,
    "PhoneService": "Yes",
    "MultipleLines": "No",
    "InternetService": "Fiber optic",
    "OnlineSecurity": "No",
    "OnlineBackup": "Yes",
    "DeviceProtection": "No",
    "TechSupport": "No",
    "StreamingTV": "Yes",
    "StreamingMovies": "Yes",
    "Contract": "Month-to-month",
    "PaperlessBilling": "Yes",
    "PaymentMethod": "Electronic check",
    "MonthlyCharges": 85.50,
    "TotalCharges": 1026.00
}

# Test 3: Invalid tenure
invalid_tenure_data = invalid_data.copy()
invalid_tenure_data["gender"] = "Male"
invalid_tenure_data["tenure"] = 100

tests = [
    ("Missing Feature", missing_data),
    ("Invalid Category", invalid_data),
    ("Invalid Tenure", invalid_tenure_data)
]

for test_name, data in tests:
    response = requests.post(url, json=data)

    print("\nTest:", test_name)
    print("Status Code:", response.status_code)
    print("Response:", response.json())
