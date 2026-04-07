"""
Configuration for FeidUp ML Service
"""
import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent
MODEL_DIR = BASE_DIR / 'models'
MODEL_PATH = MODEL_DIR / 'gradient_boost_model.pkl'
SCALER_PATH = MODEL_DIR / 'feature_scaler.pkl'

# Model hyperparameters
MODEL_CONFIG = {
    'n_estimators': 100,
    'max_depth': 5,
    'learning_rate': 0.1,
    'min_samples_split': 10,
    'min_samples_leaf': 5,
    'random_state': 42,
}

# Feature engineering
FEATURE_CONFIG = {
    'avg_foot_traffic': 400,  # Baseline average
    'avg_packaging_volume': 250,  # Baseline average
    'max_distance_km': 50,  # Max distance to consider
}

# Hybrid scoring weights
HYBRID_WEIGHTS = {
    'ml_score': 0.7,
    'rule_based_score': 0.3,
}

# API configuration
API_CONFIG = {
    'host': '0.0.0.0',
    'port': 5001,
    'debug': os.getenv('FLASK_DEBUG', 'false').lower() == 'true',
}

# Training data generation
SYNTHETIC_DATA_CONFIG = {
    'n_samples': 1000,
    'noise_level': 0.15,  # Add 15% noise to synthetic labels
}
