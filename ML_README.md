# FeidUp ML-Enhanced Matching System

## 🎯 Overview

This implementation adds **machine learning capabilities** to the FeidUp cafe-advertiser matching engine using a gradient boosting model to predict placement success (QR scan rates).

### Key Benefits

- **70% ML + 30% Rule-Based Hybrid Scoring** for best of both worlds
- **R² = 0.88** prediction accuracy on synthetic data
- **26 Engineered Features** from ABS Census data, cafe metrics, and targeting preferences
- **Fully Explainable** with feature importance and SHAP values
- **Graceful Fallback** to rule-based scoring if ML unavailable
- **100% Free** using scikit-learn and Flask

---

## 📂 Project Structure

```
feidup-location-backend/
├── python-ml-service/           # ML API service
│   ├── features.py             # Feature engineering (26 features)
│   ├── synthetic_data.py       # Training data generator
│   ├── model.py                # Gradient boosting model
│   ├── explainability.py       # SHAP + feature importance
│   ├── api.py                  # Flask REST API
│   ├── config.py               # Configuration
│   ├── start.sh                # Startup script
│   ├── QUICKSTART.md           # Quick reference
│   ├── models/                 # Trained models
│   │   ├── gradient_boost_model.pkl
│   │   ├── feature_scaler.pkl
│   │   └── training_data.csv
│   └── venv/                   # Python virtual environment
│
├── src/services/
│   └── ml-matching.service.ts  # TypeScript hybrid scoring service
│
├── src/routes/
│   └── ml.routes.ts            # ML API endpoints
│
└── requirements.txt            # Python dependencies
```

```
feidup-crm/
└── src/
    ├── api.ts                  # Updated with ML types + endpoints
    └── pages/
        └── AdvertiserRecommendationsPage.tsx  # Shows ML scores
```

---

## 🚀 Quick Start

### 1. Start ML Service

```bash
cd feidup-location-backend/python-ml-service
./start.sh
```

ML API runs on **http://localhost:5001**

### 2. Start Backend

```bash
cd feidup-location-backend
npm run dev
```

Backend runs on **http://localhost:3001** with ML integration enabled.

### 3. Start CRM

```bash
cd feidup-crm
npm run dev
```

CRM runs on **http://localhost:5174** and displays ML scores in recommendations.

### 4. Verify

```bash
# Check ML service
curl http://localhost:5001/health

# Check backend ML connection
curl http://localhost:3001/api/ml/status -H "Authorization: Bearer YOUR_TOKEN"

# View recommendations (login as advertiser@feidup.com / password123)
```

---

## 🧠 ML Model Details

### Model Architecture

- **Type**: Gradient Boosting Regressor (scikit-learn)
- **Target**: QR scan rate (scans per 100 impressions)
- **Features**: 26 engineered features
- **Training**: 1,200 synthetic samples
- **Performance**:
  - Train R² = 0.89
  - Test R² = 0.88
  - RMSE = 0.79 scans/100

### Feature Engineering (26 Features)

**Location Features (8)**:
- `foot_traffic_norm` - Normalized foot traffic
- `packaging_volume_norm` - Normalized packaging volume
- `distance_km` - Distance from target
- `distance_norm` - Normalized proximity
- `suburb_match` - Target suburb match (binary)
- `postcode_match` - Target postcode match (binary)
- `within_radius` - Within target radius (binary)
- `impression_score` - Combined volume potential

**Demographic Features (3)**:
- `age_match` - ABS Census age alignment
- `income_match` - ABS Census income alignment
- `population_density` - Suburb population

**Relevance Features (2)**:
- `tag_relevance` - Industry-tag alignment
- `num_tags` - Tag count

**Industry One-Hot (10)**:
- `industry_0` through `industry_9` - Encoded categories

**Synergy Features (3)**:
- `location_volume_synergy` - Distance × Volume
- `demo_relevance_synergy` - Demographics × Tags
- `perfect_match` - All criteria met

### Top Feature Importance

1. **within_radius** (62%) - Being within target radius is most important
2. **location_volume_synergy** (11%) - High volume + close location
3. **suburb_match** (4%) - Target suburb match
4. **distance_km** (3%) - Proximity matters
5. **demo_relevance_synergy** (2%) - Demographic + relevance fit

---

## 🔄 How Hybrid Scoring Works

```typescript
// ml-matching.service.ts
const HYBRID_WEIGHTS = {
  ml: 0.7,        // 70% ML prediction
  ruleBased: 0.3  // 30% rule-based score
};

finalScore = (mlScore × 0.7) + (ruleBasedScore × 0.3)
```

**Example**:
- ML Score: 85/100
- Rule-Based Score: 75/100
- **Hybrid Score**: (85 × 0.7) + (75 × 0.3) = **82.0/100**

### Graceful Degradation

If ML service is unavailable:
1. Backend falls back to 100% rule-based scoring
2. CRM shows "Rule-Based Only" (no ML badge)
3. System continues working normally

---

## 📊 API Endpoints

### ML Service (Port 5001)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check + model status |
| `/predict` | POST | Predict scan rate for cafe-advertiser pair |
| `/explain` | POST | Get feature importance explanation |
| `/feature-importance` | GET | Global feature importance |
| `/model-info` | GET | Model metadata |

### Backend Integration (Port 3001)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ml/recommendations/:advertiserId` | GET | Hybrid ML+rule recommendations |
| `/api/ml/explain/:advertiserId/:cafeId` | GET | Detailed ML explanation |
| `/api/ml/status` | GET | Check if ML available |

---

## 💡 Usage Examples

### Get Hybrid Recommendations

```typescript
// Frontend (CRM)
const response = await api.recommendations.get(advertiserId);
const recommendations = response.data;

recommendations.forEach(rec => {
  console.log(`${rec.cafe.name}: ${rec.matchScore}% match`);
  if (rec.isMLEnhanced) {
    console.log(`  ML Prediction: ${rec.mlScanRate} scans/100 impressions`);
    console.log(`  ML Score: ${rec.mlScore}`);
    console.log(`  Rule-Based: ${rec.ruleBasedScore}`);
  }
});
```

### Get ML Explanation

```typescript
const explanation = await api.recommendations.explain(advertiserId, cafeId);

console.log('Top Features:');
explanation.top_features.forEach(f => {
  console.log(`  ${f.name}: ${f.value} (importance: ${f.importance})`);
});
```

### Direct ML API Call

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "cafe": {
      "lat": -27.4698,
      "lng": 153.0251,
      "suburb": "Brisbane City",
      "postcode": "4000",
      "avgDailyFootTraffic": 800,
      "packagingVolume": 450,
      "tags": ["cbd", "business", "high-traffic"]
    },
    "advertiser": {
      "targetLat": -27.4700,
      "targetLng": 153.0250,
      "targetSuburbs": ["Brisbane City"],
      "targetPostcodes": ["4000"],
      "targetRadiusKm": 5,
      "industry": "fintech",
      "targetAudience": {
        "ageRange": {"min": 28, "max": 50},
        "incomeLevel": "high"
      }
    },
    "suburb": {
      "medianAge": 32,
      "medianIncome": 90000,
      "population": 12486
    }
  }'
```

Response:
```json
{
  "predicted_scan_rate": 7.93,
  "ml_score": 89.2
}
```

---

## 🔧 Configuration

### Environment Variables

Add to `feidup-location-backend/.env`:

```env
# ML Service
ML_API_URL="http://localhost:5001"
ML_ENABLED="true"
```

### Tuning Hybrid Weights

Edit `src/services/ml-matching.service.ts`:

```typescript
const HYBRID_WEIGHTS = {
  ml: 0.7,        // Adjust ML weight (0.0 - 1.0)
  ruleBased: 0.3  // Rule-based weight (should sum to 1.0)
};
```

### Model Hyperparameters

Edit `python-ml-service/config.py`:

```python
MODEL_CONFIG = {
    'n_estimators': 100,      # Number of trees
    'max_depth': 5,           # Tree depth
    'learning_rate': 0.1,     # Learning rate
    'min_samples_split': 10,  # Min samples to split
    'min_samples_leaf': 5,    # Min samples per leaf
    'random_state': 42,       # Reproducibility
}
```

---

## 📈 Continuous Learning

### Collect Real Data

As placements go live and QR scans accumulate:

```sql
-- Export real outcomes to CSV
COPY (
  SELECT 
    p.cafeId,
    p.campaignId,
    c.lat,
    c.lng,
    c.suburb,
    c.avgDailyFootTraffic,
    c.packagingVolume,
    a.industry,
    a.targetSuburbs,
    COUNT(s.id) as total_scans,
    p.actualImpressions,
    (COUNT(s.id)::float / p.actualImpressions * 100) as scan_rate
  FROM placements p
  JOIN cafes c ON p.cafeId = c.id
  JOIN campaigns camp ON p.campaignId = camp.id
  JOIN advertisers a ON camp.advertiserId = a.id
  LEFT JOIN qr_scans s ON s.qrCodeId IN (
    SELECT id FROM qr_codes WHERE placementId = p.id
  )
  WHERE p.actualImpressions > 0
  GROUP BY p.id, c.id, a.id
) TO '/path/to/real_training_data.csv' WITH CSV HEADER;
```

### Retrain Model

```bash
cd python-ml-service
source venv/bin/activate

# Retrain with real data
python model.py --train --data real_training_data.csv

# Model automatically saved and used on next API start
```

### Automated Retraining (Future)

```bash
# Add to cron (weekly)
0 2 * * 0 cd /path/to/python-ml-service && ./retrain.sh

# retrain.sh
#!/bin/bash
source venv/bin/activate
python model.py --train --data /path/to/latest_data.csv
# Restart API if needed
```

---

## 🎨 CRM UI Updates

The **Advertiser Recommendations Page** now shows:

- **ML Enhanced Badge** - When ML is active
- **Predicted Scan Rate** - e.g., "3.5 scans/100 impressions"
- **Daily Scan Estimate** - e.g., "(16 scans/day estimated)"
- **ML vs Rule-Based Breakdown** - Shows both scores + hybrid
- **ML Icon** - Purple brain icon on ML-enhanced recommendations

---

## 🐛 Troubleshooting

### ML Service Won't Start

```bash
# Check Python version (need 3.8+)
python3 --version

# Reinstall dependencies
cd python-ml-service
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt
```

### Backend Can't Connect to ML

```bash
# Check ML service is running
curl http://localhost:5001/health

# Check environment variable
echo $ML_API_URL

# Check firewall/port availability
lsof -i :5001
```

### No ML Scores in CRM

```bash
# Check ML status from backend
curl http://localhost:3001/api/ml/status \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check browser console for errors
# Verify VITE_API_URL is correct in feidup-crm/.env
```

### Model Performance Degraded

```bash
# View feature importance
curl http://localhost:5001/feature-importance

# Retrain with fresh data
cd python-ml-service
source venv/bin/activate
python model.py --train

# Check training metrics in output
```

---

## 📦 Deployment

### Development

Already set up! Just run `start.sh` in python-ml-service.

### Production (Render / Heroku / AWS)

1. **Add Python buildpack** alongside Node.js
2. **Set environment variables**:
   ```
   ML_API_URL=https://your-ml-service.com
   ML_ENABLED=true
   ```
3. **Add start command**:
   ```bash
   cd python-ml-service && ./start.sh &
   npm start
   ```
4. **Or deploy separately**:
   - Deploy ML service to separate dyno/instance
   - Point backend to ML service URL

---

## 🎯 Next Steps

### Immediate
- [x] Set up ML environment
- [x] Build feature engineering
- [x] Train initial model
- [x] Create Flask API
- [x] Integrate with backend
- [x] Update CRM UI

### Short-term
- [ ] Collect real QR scan data
- [ ] Retrain with real data
- [ ] A/B test ML vs rule-based
- [ ] Add more features (time-of-day, seasonality)

### Long-term
- [ ] Deploy ML service to production
- [ ] Implement automated weekly retraining
- [ ] Add reinforcement learning from user feedback
- [ ] Explore deep learning models (neural networks)
- [ ] Multi-objective optimization (scan rate + conversions + ROI)

---

## 📚 References

- **scikit-learn Gradient Boosting**: https://scikit-learn.org/stable/modules/ensemble.html#gradient-boosting
- **SHAP Values**: https://github.com/slundberg/shap
- **ABS Census Data**: https://www.abs.gov.au/census
- **Flask Documentation**: https://flask.palletsprojects.com/

---

## 👥 Contributors

Built with ❤️ by the FeidUp team using Claude Sonnet 4.5

## 📄 License

Proprietary - FeidUp Platform
