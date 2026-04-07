# FeidUp ML Service

Machine learning service for predicting cafe-advertiser match quality using gradient boosting.

## Setup

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r ../requirements.txt
```

## Structure

```
python-ml-service/
├── features.py          # Feature engineering
├── synthetic_data.py    # Training data generation
├── model.py            # ML model training & inference
├── explainability.py   # SHAP & feature importance
├── api.py              # Flask API server
├── config.py           # Configuration
└── models/             # Trained model artifacts
    └── .gitkeep
```

## Usage

### Train Model
```bash
python model.py --train
```

### Start API Server
```bash
python api.py
```

API will run on `http://localhost:5001`

### Endpoints

- `POST /predict` - Get ML scores for cafe-advertiser pairs
- `POST /explain` - Get feature importance for a prediction
- `GET /health` - Health check
