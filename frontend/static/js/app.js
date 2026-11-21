(() => {
  const form = document.getElementById("prediction-form");
  if (!form) return;

  const submitButton = document.getElementById("predict-button");
  const resultRegion = document.getElementById("prediction-result");
  const numericFields = ["SeniorCitizen", "tenure", "MonthlyCharges", "TotalCharges"];

  const apiBaseUrl = String(window.CHURN_API_BASE_URL || "").trim().replace(/\/$/, "");
  const predictUrl = `${apiBaseUrl}/predict`;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    if (!apiBaseUrl && window.location?.hostname.endsWith("github.io")) {
      renderError(new Error("The Render API URL is not configured for this GitHub Pages site. Set CHURN_API_BASE_URL in config.js to enable live predictions."));
      return;
    }

    const customer = Object.fromEntries(new FormData(form).entries());
    numericFields.forEach((field) => { customer[field] = Number(customer[field]); });

    setLoading(true);
    resultRegion.innerHTML = '<div class="loading-message" role="status">Checking customer details with the prediction service…</div>';

    try {
      const response = await fetch(predictUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || payload.error || `The prediction service returned ${response.status}.`);
      }
      if (payload.status !== "success" || !payload.prediction) {
        throw new Error("The prediction service returned an unexpected response.");
      }

      renderPrediction(payload.prediction);
    } catch (error) {
      renderError(error);
    } finally {
      setLoading(false);
    }
  });

  function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.setAttribute("aria-busy", String(isLoading));
    submitButton.innerHTML = isLoading
      ? 'Generating prediction <span aria-hidden="true">…</span>'
      : 'Generate prediction <span aria-hidden="true">→</span>';
  }

  function renderPrediction(prediction) {
    const probability = Number(prediction.churn_probability);
    const predicted = prediction.churn_prediction === 1;
    const label = String(prediction.churn_label || "");
    const risk = String(prediction.risk_category || "");
    const expectedRiskCategories = ["Very Low Risk", "Low Risk", "Medium Risk", "High Risk", "Very High Risk"];

    if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
      throw new Error("The prediction service returned an invalid probability.");
    }
    if (!expectedRiskCategories.includes(risk) || !["Yes", "No"].includes(label)) {
      throw new Error("The prediction service returned an invalid prediction label or risk category.");
    }

    const percent = (probability * 100).toFixed(2);
    const riskClass = risk.toLowerCase().replaceAll(" ", "-");
    const resultJson = JSON.stringify(prediction, null, 2);

    resultRegion.innerHTML = `
      <article class="prediction-card">
        <div class="prediction-header"><h2>Prediction result</h2><span class="risk-badge ${riskClass}">${escapeHtml(risk)}</span></div>
        <div class="probability-section"><p class="result-label">Churn probability</p><p class="probability-value">${percent}%</p>
          <div class="risk-scale-track" role="img" aria-label="Churn probability ${percent} percent"><div class="risk-fill" style="width:${probability * 100}%"></div></div>
          <div class="risk-scale-labels"><span>Very low</span><span>Low</span><span>Medium</span><span>High</span><span>Very high</span></div>
        </div>
        <div class="prediction-details">
          <div class="detail-item"><span class="detail-label">Churn prediction</span><strong class="${predicted ? "churn-yes" : "churn-no"}">${escapeHtml(label)}</strong></div>
          <div class="detail-item"><span class="detail-label">Risk category</span><strong>${escapeHtml(risk)}</strong></div>
          <div class="detail-item"><span class="detail-label">Probability</span><strong>${percent}%</strong></div>
        </div>
        <div class="prediction-explanation"><p>${predicted ? "The model estimates that this customer may churn. Review the profile and consider whether follow-up is appropriate." : "The model estimates a lower likelihood of churn for this profile. Continue to use customer context when deciding on next steps."}</p></div>
        <button type="button" class="copy-json-button" id="copy-prediction">Copy prediction JSON</button>
      </article>`;

    document.getElementById("copy-prediction").addEventListener("click", async (event) => {
      const button = event.currentTarget;
      try {
        await navigator.clipboard.writeText(resultJson);
        button.textContent = "Copied";
      } catch {
        button.textContent = "Copy unavailable";
      }
    });
  }

  function renderError(error) {
    const message = error instanceof TypeError
      ? "Could not reach the prediction service. Check that the Flask API is running and the configured API URL is correct."
      : error.message;
    resultRegion.innerHTML = `<div class="error-message" role="alert"><h3>Prediction unavailable</h3><p>${escapeHtml(message)}</p><p>Check the customer details and try again.</p></div>`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[character]);
  }
})();
