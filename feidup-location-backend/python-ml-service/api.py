"""
Flask API for ML Model

REST API endpoints for cafe-advertiser matching predictions
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from pathlib import Path
import traceback

from model import MatchingModel
from explainability import create_explainer
from config import API_CONFIG, MODEL_PATH, SCALER_PATH

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for CRM frontend

# Load model on startup
ml_model = None
explainer = None

def load_model():
    """Load the trained ML model"""
    global ml_model, explainer
    
    try:
        ml_model = MatchingModel()
        ml_model.load(MODEL_PATH, SCALER_PATH)
        explainer = create_explainer(ml_model.model, ml_model.scaler)
        print("✓ ML model loaded successfully")
        return True
    except FileNotFoundError as e:
        print(f"✗ Model not found: {e}")
        print("  Train a model first with: python model.py --train")
        return False
    except Exception as e:
        print(f"✗ Error loading model: {e}")
        traceback.print_exc()
        return False


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': ml_model is not None,
        'service': 'feidup-ml-api'
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict scan rate for cafe-advertiser pair(s)
    
    Request body:
    {
        "cafe": {...},
        "advertiser": {...},
        "suburb": {...}  // optional
    }
    
    Or for batch predictions:
    {
        "pairs": [
            {"cafe": {...}, "advertiser": {...}, "suburb": {...}},
            ...
        ]
    }
    
    Returns:
    {
        "predicted_scan_rate": 3.45,
        "ml_score": 68.5  // normalized to 0-100
    }
    """
    if ml_model is None:
        return jsonify({'error': 'Model not loaded'}), 503
    
    try:
        data = request.get_json()
        
        # Single prediction
        if 'cafe' in data and 'advertiser' in data:
            cafe_data = data['cafe']
            advertiser_data = data['advertiser']
            suburb_data = data.get('suburb')
            
            # Predict
            scan_rate = ml_model.predict_single(cafe_data, advertiser_data, suburb_data)
            
            # Normalize to 0-100 score (assume 0.5-8.0 range maps to 0-100)
            ml_score = min(100, max(0, ((scan_rate - 0.5) / 7.5) * 100))
            
            return jsonify({
                'predicted_scan_rate': round(float(scan_rate), 2),
                'ml_score': round(float(ml_score), 1)
            })
        
        # Batch predictions
        elif 'pairs' in data:
            results = []
            
            for pair in data['pairs']:
                cafe_data = pair['cafe']
                advertiser_data = pair['advertiser']
                suburb_data = pair.get('suburb')
                
                scan_rate = ml_model.predict_single(cafe_data, advertiser_data, suburb_data)
                ml_score = min(100, max(0, ((scan_rate - 0.5) / 7.5) * 100))
                
                results.append({
                    'cafe_id': cafe_data.get('id'),
                    'predicted_scan_rate': round(float(scan_rate), 2),
                    'ml_score': round(float(ml_score), 1)
                })
            
            return jsonify({'predictions': results})
        
        else:
            return jsonify({'error': 'Invalid request format'}), 400
    
    except Exception as e:
        print(f"Prediction error: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/explain', methods=['POST'])
def explain():
    """
    Explain a prediction with feature importance/SHAP values
    
    Request body:
    {
        "cafe": {...},
        "advertiser": {...},
        "suburb": {...}  // optional
    }
    
    Returns explanation with top contributing features
    """
    if ml_model is None or explainer is None:
        return jsonify({'error': 'Model not loaded'}), 503
    
    try:
        data = request.get_json()
        
        cafe_data = data.get('cafe')
        advertiser_data = data.get('advertiser')
        suburb_data = data.get('suburb')
        
        if not cafe_data or not advertiser_data:
            return jsonify({'error': 'cafe and advertiser data required'}), 400
        
        # Get detailed explanation
        explanation = ml_model.explain_prediction(cafe_data, advertiser_data, suburb_data)
        
        # Generate human-readable text
        explanation_text = explainer.generate_human_explanation(
            cafe_data, advertiser_data, suburb_data
        )
        
        return jsonify({
            **explanation,
            'explanation_text': explanation_text
        })
    
    except Exception as e:
        print(f"Explanation error: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/feature-importance', methods=['GET'])
def feature_importance():
    """
    Get global feature importance from the model
    
    Returns top N most important features
    """
    if ml_model is None:
        return jsonify({'error': 'Model not loaded'}), 503
    
    try:
        top_n = request.args.get('top_n', 20, type=int)
        
        importances = ml_model.get_feature_importance(top_n)
        
        return jsonify({
            'feature_importances': [
                {
                    'feature': name,
                    'importance': round(float(importance), 4)
                }
                for name, importance in importances
            ]
        })
    
    except Exception as e:
        print(f"Feature importance error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/model-info', methods=['GET'])
def model_info():
    """
    Get information about the loaded model
    """
    if ml_model is None:
        return jsonify({'error': 'Model not loaded'}), 503
    
    return jsonify({
        'model_type': 'GradientBoostingRegressor',
        'num_features': len(ml_model.feature_names_),
        'feature_names': ml_model.feature_names_,
        'model_path': str(MODEL_PATH),
        'scaler_path': str(SCALER_PATH)
    })


def main():
    """Start the API server"""
    print("=" * 60)
    print("FeidUp ML API Server")
    print("=" * 60)
    
    # Load model
    if not load_model():
        print("\n⚠️  Warning: Starting server without model")
        print("   Some endpoints will return 503 errors")
    
    print(f"\nStarting server on {API_CONFIG['host']}:{API_CONFIG['port']}")
    print(f"Debug mode: {API_CONFIG['debug']}")
    print("\nAvailable endpoints:")
    print("  GET  /health              - Health check")
    print("  POST /predict             - Predict scan rate")
    print("  POST /explain             - Explain prediction")
    print("  GET  /feature-importance  - Get feature importance")
    print("  GET  /model-info          - Get model information")
    print("\n" + "=" * 60 + "\n")
    
    # Start server
    app.run(
        host=API_CONFIG['host'],
        port=API_CONFIG['port'],
        debug=API_CONFIG['debug']
    )


if __name__ == '__main__':
    main()
