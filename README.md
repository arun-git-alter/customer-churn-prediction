# Customer Churn Prediction

A customer churn classification project with a sigmoid-calibrated Random Forest, Flask prediction API, and static three-page showcase.

## Project structure

- `frontend/` — GitHub Pages website: Overview, Methodology, Team, and shared assets
- `backend/` — Flask app, input validation, model loading, and prediction logic
- `models/` — calibrated model and configuration required by the API
- `data/` — local raw and processed telecom churn data
- `notebooks/` — analysis and model development notebooks

## Run locally

Install the dependencies in `requirements.txt`, then start Flask from the repository root:

```bash
python -m backend.app
```

Open `http://127.0.0.1:5000`. The Flask app serves the static frontend and the existing `POST /predict` endpoint on the same origin.

## GitHub Pages and Render

The workflow at `.github/workflows/pages.yml` publishes `frontend/` to GitHub Pages. In the repository settings, select **GitHub Actions** as the Pages build and deployment source.

Set the deployed Render service URL in `frontend/static/js/config.js`:

```js
window.CHURN_API_BASE_URL = "https://your-service.onrender.com";
```

The value should be the service origin without a trailing slash. The frontend appends `/predict`. The Flask API's CORS allowlist must include the GitHub Pages site origin if that origin changes.

## Team page

`frontend/team.html` contains marked placeholders because the repository does not include a verified team roster or contribution record. Replace those fields with project-approved names, roles, and responsibilities before presenting them as facts.
