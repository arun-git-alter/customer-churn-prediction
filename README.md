# Customer Churn Prediction

A telecom customer churn classification project with a calibrated Random Forest, a Flask prediction API, and a responsive three-page project showcase.

The website introduces the project, documents its methodology, presents the team, and includes a live form that submits customer profiles to the existing prediction API. The model returns a churn probability, a binary churn label, and a probability-based risk category.

## Project structure

| Path | Purpose |
| --- | --- |
| `frontend/` | Static GitHub Pages site and shared HTML, CSS, and JavaScript assets |
| `backend/` | Flask app, input validation, model loading, and prediction logic |
| `models/` | Saved calibrated model and model configuration used by the API |
| `data/` | Local raw and processed telecom churn data |
| `notebooks/` | Local data exploration and model development notebooks |

The deployed API expects 19 customer features. The field names, validation rules, model workflow, and risk bands are documented on the site’s [Methodology page](frontend/methodology.html).

## Run locally

Use Python 3 and install the project dependencies from the repository root:

```bash
python -m venv .venv
```

Activate the environment, then install dependencies and start Flask:

```powershell
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m backend.app
```

```bash
# macOS or Linux
source .venv/bin/activate
pip install -r requirements.txt
python -m backend.app
```

Open <http://127.0.0.1:5000>. Flask serves the static frontend and prediction API on the same origin. The model is loaded when the Flask application starts.

## Prediction API

- `POST /predict` accepts a JSON object containing all 19 model features.
- Categorical values and numeric fields are validated by the backend.
- A successful response includes `churn_probability`, `churn_prediction`, `churn_label`, and `risk_category`.
- The binary classification threshold is `0.50`; risk categories use probability bands from below 20% through 80% and above.

The local API test script, `test_api.py`, sends invalid and incomplete examples to a running server at `http://127.0.0.1:5000`.

## Deploy the frontend to GitHub Pages

The workflow at `.github/workflows/pages.yml` publishes the `frontend/` directory when changes are pushed to `main`. In the repository’s **Settings → Pages**, select **GitHub Actions** as the build and deployment source.

Set the Render service origin in `frontend/static/js/config.js` before publishing:

```js
window.CHURN_API_BASE_URL = "https://your-service.onrender.com";
```

Use the service origin without a trailing slash. The frontend appends `/predict`. Leave this setting blank for local Flask use, where the browser submits to the same-origin `/predict` route.

The Flask CORS allowlist currently includes `https://arun-git-alter.github.io` and local Flask origins. If you use a custom GitHub Pages domain or another frontend origin, add that exact origin to `ALLOWED_ORIGINS` in `backend/app.py` and redeploy the backend.

## Deploy the API to Render

Create a Render web service for this repository with:

- **Build command:** `pip install -r requirements.txt`
- **Start command:** `gunicorn backend.app:app`

After deployment, copy the Render service origin into `frontend/static/js/config.js` and push the change so GitHub Pages deploys the updated frontend. The calibrated model artifact and its configuration are tracked in `models/` and are loaded by the Flask app at startup.

## Team

The project report names four student authors: Arun Kumar Gupta (11232567), Khushi Singh (11232512), Ashmit Tanwar (11232575), and Archita Garg (11232560). It names Dr. Mohit Chhabra, Assistant Professor, as the project supervisor. Individual student roles, contributions, and coordination details were not assigned in the report, so those fields remain placeholders on `frontend/team.html`.
