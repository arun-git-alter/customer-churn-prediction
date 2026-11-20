
import joblib

from backend.config import MODEL_PATH


def load_model():

    # Check whether the saved model exists
    if not MODEL_PATH.is_file():
        raise FileNotFoundError(
            f"Calibrated model not found at: {MODEL_PATH}"
        )

    try:
        # Load the existing trained model
        model = joblib.load(MODEL_PATH)

        # Verify that the model supports prediction
        required_methods = ["predict", "predict_proba"]

        for method in required_methods:
            if not callable(getattr(model, method, None)):
                raise TypeError(
                    f"Loaded model does not support {method}()"
                )

        print("Calibrated model loaded successfully!")

        return model

    except Exception as error:
        raise RuntimeError(
            f"Failed to load calibrated model: {error}"
        ) from error
