"""
ML Model for Cafe-Advertiser Matching

Gradient Boosting model to predict placement success (QR scan rate)
"""
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
from pathlib import Path
import argparse
from typing import Dict, Any, List, Optional, Tuple

from features import extract_features, feature_names, features_to_array
from synthetic_data import generate_synthetic_data
from config import MODEL_CONFIG, MODEL_PATH, SCALER_PATH, MODEL_DIR


class MatchingModel:
    """
    Gradient Boosting model for predicting cafe-advertiser match quality
    """
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_importances_ = None
        self.feature_names_ = feature_names()
    
    def train(self, X: np.ndarray, y: np.ndarray, validate: bool = True) -> Dict[str, float]:
        """
        Train the gradient boosting model
        
        Args:
            X: Feature matrix (n_samples, n_features)
            y: Target values (scan rates)
            validate: Whether to perform cross-validation
        
        Returns:
            Dictionary of training metrics
        """
        print("Training Gradient Boosting model...")
        
        # Initialize and fit scaler
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        # Initialize model
        self.model = GradientBoostingRegressor(**MODEL_CONFIG)
        
        # Train-test split for validation
        if validate:
            X_train, X_test, y_train, y_test = train_test_split(
                X_scaled, y, test_size=0.2, random_state=42
            )
            
            # Train model
            self.model.fit(X_train, y_train)
            
            # Predictions
            y_pred_train = self.model.predict(X_train)
            y_pred_test = self.model.predict(X_test)
            
            # Calculate metrics
            metrics = {
                'train_rmse': np.sqrt(mean_squared_error(y_train, y_pred_train)),
                'test_rmse': np.sqrt(mean_squared_error(y_test, y_pred_test)),
                'train_mae': mean_absolute_error(y_train, y_pred_train),
                'test_mae': mean_absolute_error(y_test, y_pred_test),
                'train_r2': r2_score(y_train, y_pred_train),
                'test_r2': r2_score(y_test, y_pred_test),
            }
            
            # Cross-validation
            cv_scores = cross_val_score(
                self.model, X_scaled, y, cv=5, 
                scoring='neg_mean_squared_error'
            )
            metrics['cv_rmse'] = np.sqrt(-cv_scores.mean())
            metrics['cv_rmse_std'] = np.sqrt(cv_scores.std())
            
            print(f"\nTraining Results:")
            print(f"  Train RMSE: {metrics['train_rmse']:.3f}")
            print(f"  Test RMSE:  {metrics['test_rmse']:.3f}")
            print(f"  Train MAE:  {metrics['train_mae']:.3f}")
            print(f"  Test MAE:   {metrics['test_mae']:.3f}")
            print(f"  Train R²:   {metrics['train_r2']:.3f}")
            print(f"  Test R²:    {metrics['test_r2']:.3f}")
            print(f"  CV RMSE:    {metrics['cv_rmse']:.3f} ± {metrics['cv_rmse_std']:.3f}")
            
        else:
            # Train on full dataset
            self.model.fit(X_scaled, y)
            y_pred = self.model.predict(X_scaled)
            
            metrics = {
                'train_rmse': np.sqrt(mean_squared_error(y, y_pred)),
                'train_mae': mean_absolute_error(y, y_pred),
                'train_r2': r2_score(y, y_pred),
            }
            
            print(f"\nTraining Results (full dataset):")
            print(f"  RMSE: {metrics['train_rmse']:.3f}")
            print(f"  MAE:  {metrics['train_mae']:.3f}")
            print(f"  R²:   {metrics['train_r2']:.3f}")
        
        # Store feature importances
        self.feature_importances_ = self.model.feature_importances_
        
        return metrics
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Predict scan rates for feature matrix
        
        Args:
            X: Feature matrix (n_samples, n_features)
        
        Returns:
            Predicted scan rates (scans per 100 impressions)
        """
        if self.model is None:
            raise ValueError("Model not trained. Call train() first or load a trained model.")
        
        X_scaled = self.scaler.transform(X)
        predictions = self.model.predict(X_scaled)
        
        # Ensure predictions are in realistic range
        return np.clip(predictions, 0.5, 8.0)
    
    def predict_single(self, cafe_data: Dict[str, Any], 
                      advertiser_data: Dict[str, Any],
                      suburb_data: Optional[Dict[str, Any]] = None) -> float:
        """
        Predict scan rate for a single cafe-advertiser pair
        
        Args:
            cafe_data: Cafe information dictionary
            advertiser_data: Advertiser information dictionary
            suburb_data: Optional suburb demographic data
        
        Returns:
            Predicted scan rate (scans per 100 impressions)
        """
        # Extract features
        features = extract_features(cafe_data, advertiser_data, suburb_data)
        
        # Convert to array
        X = features_to_array(features).reshape(1, -1)
        
        # Predict
        return self.predict(X)[0]
    
    def get_feature_importance(self, top_n: int = 10) -> List[Tuple[str, float]]:
        """
        Get top N most important features
        
        Args:
            top_n: Number of top features to return
        
        Returns:
            List of (feature_name, importance) tuples
        """
        if self.feature_importances_ is None:
            raise ValueError("Model not trained yet")
        
        # Sort by importance
        indices = np.argsort(self.feature_importances_)[::-1]
        
        return [
            (self.feature_names_[i], self.feature_importances_[i])
            for i in indices[:top_n]
        ]
    
    def explain_prediction(self, cafe_data: Dict[str, Any],
                          advertiser_data: Dict[str, Any],
                          suburb_data: Optional[Dict[str, Any]] = None,
                          top_n: int = 5) -> Dict[str, Any]:
        """
        Explain a prediction by showing top contributing features
        
        Args:
            cafe_data: Cafe information
            advertiser_data: Advertiser information
            suburb_data: Optional suburb data
            top_n: Number of top features to show
        
        Returns:
            Dictionary with prediction and explanation
        """
        # Get prediction
        predicted_rate = self.predict_single(cafe_data, advertiser_data, suburb_data)
        
        # Extract features
        features = extract_features(cafe_data, advertiser_data, suburb_data)
        
        # Get feature importances
        importances = dict(self.get_feature_importance(len(self.feature_names_)))
        
        # Calculate contribution (feature_value * importance)
        contributions = {
            name: features[name] * importances.get(name, 0)
            for name in features.keys()
        }
        
        # Get top contributing features
        top_contributors = sorted(
            contributions.items(), 
            key=lambda x: abs(x[1]), 
            reverse=True
        )[:top_n]
        
        return {
            'predicted_scan_rate': round(predicted_rate, 2),
            'top_features': [
                {
                    'name': name,
                    'value': round(features[name], 3),
                    'importance': round(importances.get(name, 0), 3),
                    'contribution': round(contrib, 3)
                }
                for name, contrib in top_contributors
            ],
            'all_features': {k: round(v, 3) for k, v in features.items()}
        }
    
    def save(self, model_path: Path = None, scaler_path: Path = None):
        """Save trained model and scaler"""
        if model_path is None:
            model_path = MODEL_PATH
        if scaler_path is None:
            scaler_path = SCALER_PATH
        
        # Ensure directory exists
        model_path.parent.mkdir(parents=True, exist_ok=True)
        
        joblib.dump(self.model, model_path)
        joblib.dump(self.scaler, scaler_path)
        
        print(f"Model saved to {model_path}")
        print(f"Scaler saved to {scaler_path}")
    
    def load(self, model_path: Path = None, scaler_path: Path = None):
        """Load trained model and scaler"""
        if model_path is None:
            model_path = MODEL_PATH
        if scaler_path is None:
            scaler_path = SCALER_PATH
        
        if not model_path.exists():
            raise FileNotFoundError(f"Model not found at {model_path}")
        if not scaler_path.exists():
            raise FileNotFoundError(f"Scaler not found at {scaler_path}")
        
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)
        self.feature_importances_ = self.model.feature_importances_
        
        print(f"Model loaded from {model_path}")
        print(f"Scaler loaded from {scaler_path}")


def train_from_dataframe(df: pd.DataFrame) -> MatchingModel:
    """
    Train model from a pandas DataFrame
    
    Args:
        df: DataFrame with features and 'scan_rate' target column
    
    Returns:
        Trained MatchingModel instance
    """
    # Separate features and target
    feature_cols = [col for col in df.columns if col not in ['cafe_id', 'advertiser_id', 'scan_rate']]
    X = df[feature_cols].values
    y = df['scan_rate'].values
    
    # Train model
    model = MatchingModel()
    metrics = model.train(X, y, validate=True)
    
    # Show feature importance
    print("\nTop 10 Most Important Features:")
    for name, importance in model.get_feature_importance(10):
        print(f"  {name}: {importance:.4f}")
    
    return model


def main():
    """Main training script"""
    parser = argparse.ArgumentParser(description='Train ML model for cafe-advertiser matching')
    parser.add_argument('--train', action='store_true', help='Train a new model')
    parser.add_argument('--load', action='store_true', help='Load existing model')
    parser.add_argument('--test', action='store_true', help='Test prediction on sample data')
    parser.add_argument('--data', type=str, default=None, help='Path to training data CSV')
    
    args = parser.parse_args()
    
    if args.train:
        # Generate or load training data
        if args.data and Path(args.data).exists():
            print(f"Loading training data from {args.data}")
            df = pd.read_csv(args.data)
        else:
            print("Generating synthetic training data...")
            df = generate_synthetic_data()
        
        # Train model
        model = train_from_dataframe(df)
        
        # Save model
        model.save()
        
    elif args.load:
        model = MatchingModel()
        model.load()
        
        print("\nModel loaded successfully!")
        print(f"Features: {len(model.feature_names_)}")
        
    elif args.test:
        # Load model
        model = MatchingModel()
        try:
            model.load()
        except FileNotFoundError:
            print("No trained model found. Training new model first...")
            df = generate_synthetic_data()
            model = train_from_dataframe(df)
            model.save()
        
        # Test prediction
        test_cafe = {
            'lat': -27.4698,
            'lng': 153.0251,
            'suburb': 'Brisbane City',
            'postcode': '4000',
            'avgDailyFootTraffic': 800,
            'packagingVolume': 450,
            'tags': ['cbd', 'business', 'high-traffic'],
        }
        
        test_advertiser = {
            'targetLat': -27.4700,
            'targetLng': 153.0250,
            'targetSuburbs': ['Brisbane City'],
            'targetPostcodes': ['4000'],
            'targetRadiusKm': 5,
            'industry': 'fintech',
            'targetAudience': {
                'ageRange': {'min': 28, 'max': 50},
                'incomeLevel': 'high',
            }
        }
        
        test_suburb = {
            'medianAge': 32,
            'medianIncome': 90000,
            'population': 12486,
        }
        
        # Get explanation
        explanation = model.explain_prediction(test_cafe, test_advertiser, test_suburb)
        
        print("\n=== Test Prediction ===")
        print(f"Cafe: {test_cafe['suburb']}")
        print(f"Advertiser Industry: {test_advertiser['industry']}")
        print(f"\nPredicted Scan Rate: {explanation['predicted_scan_rate']:.2f} scans/100 impressions")
        print(f"\nTop Contributing Features:")
        for feat in explanation['top_features']:
            print(f"  {feat['name']}: {feat['value']:.3f} (importance: {feat['importance']:.3f})")
    
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
