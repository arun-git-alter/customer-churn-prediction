
from flask import Flask, request, jsonify, render_template

from backend.model_loader import load_model
from backend.validator import validate_customer_data
from backend.predictor import predict_customer


app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static",
    static_url_path="/static"
)

# Load the trained model once when the server starts
model = load_model()


# Website landing page
@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")


# API health check
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "message": "Customer Churn Prediction API is running",
        "status": "success"
    })


# Customer churn prediction endpoint
@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json(silent=True)

        if data is None:
            return jsonify({
                "error": "Request must contain valid JSON."
            }), 400

        customer_data = validate_customer_data(data)
        result = predict_customer(customer_data, model)

        return jsonify({
            "status": "success",
            "prediction": result
        }), 200

    except ValueError as error:
        return jsonify({
            "status": "error",
            "message": str(error)
        }), 400

    except Exception:
        app.logger.exception("Prediction failed")

        return jsonify({
            "status": "error",
            "message": "An internal prediction error occurred."
        }), 500


if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )
