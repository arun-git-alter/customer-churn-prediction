
document.addEventListener("DOMContentLoaded", () => {
    const predictionForm = document.getElementById("prediction-form");
    const predictButton = document.getElementById("predict-button");
    const predictionResult = document.getElementById("prediction-result");

    if (!predictionForm || !predictButton || !predictionResult) {
        console.error("Required HTML elements were not found.");
        return;
    }

    // Submit customer data to the Flask prediction API
    predictionForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        predictButton.disabled = true;
        predictButton.textContent = "Predicting...";

        predictionResult.innerHTML = `
            <div class="loading-message">
                Analyzing customer data...
            </div>
        `;

        try {
            const formData = new FormData(predictionForm);
            const customerData = Object.fromEntries(formData.entries());

            // Convert numerical fields into numbers
            customerData.SeniorCitizen = Number(customerData.SeniorCitizen);
            customerData.tenure = Number(customerData.tenure);
            customerData.MonthlyCharges = Number(customerData.MonthlyCharges);
            customerData.TotalCharges = Number(customerData.TotalCharges);

            const response = await fetch("/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(customerData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || "Prediction failed.");
            }

            if (data.status !== "success" || !data.prediction) {
                throw new Error("Invalid response received from the API.");
            }

            displayPrediction(data.prediction);

        } catch (error) {
            predictionResult.innerHTML = `
                <div class="error-message">
                    <h3>Prediction Error</h3>
                    <p>${escapeHTML(error.message)}</p>
                    <p>Please check your inputs and try again.</p>
                </div>
            `;

            console.error("Prediction error:", error);

        } finally {
            predictButton.disabled = false;
            predictButton.textContent = "Predict Churn";
        }
    });

    // Display prediction results
    function displayPrediction(prediction) {
        const probability = Number(prediction.churn_probability);

        if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
            throw new Error("The API returned an invalid churn probability.");
        }

        const probabilityPercent = (probability * 100).toFixed(2);
        const probabilityPosition = probability * 100;

        const isChurnPredicted = prediction.churn_prediction === 1;
        const churnLabel = prediction.churn_label;
        const riskCategory = prediction.risk_category;

        const riskClass = String(riskCategory)
            .toLowerCase()
            .replace(/\s+/g, "-");

        const predictionClass = isChurnPredicted
            ? "churn-yes"
            : "churn-no";

        const resultJSON = JSON.stringify(prediction, null, 2);

        predictionResult.innerHTML = `
            <div class="prediction-card">

                <div class="prediction-header">
                    <h2>Prediction Result</h2>
                    <span class="risk-badge ${riskClass}">
                        ${escapeHTML(riskCategory)}
                    </span>
                </div>

                <div class="probability-section">
                    <p class="result-label">Churn Probability</p>

                    <h1 class="probability-value">
                        ${probabilityPercent}%
                    </h1>

                    <div class="risk-scale">

                        <div class="risk-scale">

    <div class="risk-ruler">
        <div class="risk-ruler-marker"
             style="left: ${Math.min(100, Math.max(0, probabilityPosition))}%">
            <span>${probabilityPercent}%</span>
        </div>
    </div>

    <div class="risk-scale-track">
        <div class="risk-fill"
             style="width: ${probabilityPosition}%">
        </div>
    </div>

    <div class="risk-scale-labels">
        <span>Very Low</span>
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
        <span>Very High</span>
    </div>

</div>

                <div class="prediction-details">

                    <div class="detail-item">
                        <span class="detail-label">Churn Prediction</span>
                        <strong class="${predictionClass}">
                            ${escapeHTML(churnLabel)}
                        </strong>
                    </div>

                    <div class="detail-item">
                        <span class="detail-label">Risk Category</span>
                        <strong>
                            ${escapeHTML(riskCategory)}
                        </strong>
                    </div>

                    <div class="detail-item">
                        <span class="detail-label">Probability</span>
                        <strong>${probabilityPercent}%</strong>
                    </div>

                </div>

                <div class="prediction-explanation">
                    <h3>What does this mean?</h3>
                    <p>
                        ${
                            isChurnPredicted
                                ? "The model predicts that this customer is likely to leave the service. Consider taking suitable retention actions."
                                : "The model predicts that this customer is unlikely to leave the service based on the provided information."
                        }
                    </p>
                </div>

                <button type="button" class="copy-json-button" id="copy-json-button">
                    Copy Prediction JSON
                </button>

            </div>
        `;

        // Copy prediction result as JSON
        const copyButton = document.getElementById("copy-json-button");

        copyButton.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(resultJSON);

                copyButton.textContent = "Copied!";

                setTimeout(() => {
                    copyButton.textContent = "Copy Prediction JSON";
                }, 2000);

            } catch (error) {
                console.error("Copy failed:", error);
                copyButton.textContent = "Copy failed";
            }
        });
    }

    // Prevent HTML injection in dynamic text
    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, (character) => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return entities[character];
        });
    }
});
