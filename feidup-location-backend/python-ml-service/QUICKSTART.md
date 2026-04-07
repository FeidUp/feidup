# ML Service - Quick Reference

## 🚀 Quick Start

### 1. Start ML API Service
```bash
cd python-ml-service
./start.sh
```

The API will run on `http://localhost:5001`

### 2. Start Backend (in another terminal)
```bash
cd ..
npm run dev
```

Backend will run on `http://localhost:3001` and automatically connect to ML service.

### 3. Test ML Integration
```bash
curl http://localhost:5001/health
curl http://localhost:3001/api/ml/status
```

## 📊 ML Model Performance

- **Model Type**: Gradient Boosting Regressor
- **Training R²**: 0.89
- **Test R²**: 0.88
- **Features**: 26 engineered features
- **Hybrid Scoring**: 70% ML + 30% rule-based

## 🔑 Key Features

### 1. Feature Engineering (26 features)
- **Location**: distance, suburb match, within radius
- **Volume**: foot traffic, packaging volume normalized
- **Demographics**: age match, income match from ABS Census  
- **Relevance**: industry-tag alignment
- **Synergy**: location×volume, demographics×relevance

### 2. Hybrid Scoring
- ML score predicts QR scan rate (0.5-8.0 scans/100 impressions)
- Combined with rule-based scoring for transparency
- Falls back gracefully if ML service unavailable

### 3. Explainability
- Feature importance rankings
- SHAP values (optional)
- Human-readable explanations

## 🛠 Management Commands

### Retrain Model
```bash
cd python-ml-service
source venv/bin/activate
python model.py --train
```

### Test Predictions
```bash
python model.py --test
```

### Generate More Training Data
```bash
python synthetic_data.py
```

### View Feature Importance
```bash
curl http://localhost:5001/feature-importance
```

## 📝 API Endpoints

### ML Service (Port 5001)
- `GET /health` - Health check
- `POST /predict` - Get scan rate predictions
- `POST /explain` - Explain prediction
- `GET /feature-importance` - Top features
- `GET /model-info` - Model metadata

### Backend Integration (Port 3001)
- `GET /api/ml/recommendations/:advertiserId` - Hybrid recommendations
- `GET /api/ml/explain/:advertiserId/:cafeId` - ML explanation
- `GET /api/ml/status` - Check ML availability

## 🔧 Configuration

### Environment Variables (.env)
```
ML_API_URL=http://localhost:5001
ML_ENABLED=true
```

### Hybrid Weights (ml-matching.service.ts)
```typescript
const HYBRID_WEIGHTS = {
  ml: 0.7,        // ML prediction weight
  ruleBased: 0.3  // Rule-based score weight
};
```

## 📈 Continuous Learning

As real placement data accumulates:

1. Log actual QR scan outcomes to database
2. Export to CSV:
   ```sql
   COPY (SELECT ...) TO 'real_data.csv';
   ```
3. Retrain model:
   ```bash
   python model.py --train --data real_data.csv
   ```
4. Model auto-improves over time!

## 🐛 Troubleshooting

### ML service won't start
```bash
# Check Python version
python3 --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt
```

### Backend can't connect to ML
```bash
# Check ML service is running
curl http://localhost:5001/health

# Check environment variable
echo $ML_API_URL
```

### Model performance degraded
```bash
# Retrain with fresh data
python model.py --train

# Check training metrics
```

## 🎯 Next Steps

- [ ] Collect real QR scan data from live placements
- [ ] Implement automated weekly retraining
- [ ] A/B test ML vs rule-based scores
- [ ] Add more features (time-of-day, seasonality)
- [ ] Deploy ML service to production
