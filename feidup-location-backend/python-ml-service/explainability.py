"""
Model Explainability using SHAP

Provides detailed explanations for model predictions using SHAP values
and feature importance analysis.
"""
import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional
import warnings

try:
    import shap
    SHAP_AVAILABLE = True
except ImportError:
    SHAP_AVAILABLE = False
    warnings.warn("SHAP not available. Install with: pip install shap")

from features import extract_features, features_to_array, feature_names


class ModelExplainer:
    """
    Explains model predictions using SHAP values and feature importance
    """
    
    def __init__(self, model, scaler, feature_names_list: List[str]):
        """
        Args:
            model: Trained sklearn model
            scaler: Fitted StandardScaler
            feature_names_list: List of feature names
        """
        self.model = model
        self.scaler = scaler
        self.feature_names_list = feature_names_list
        self.explainer = None
        
        if SHAP_AVAILABLE:
            # Initialize SHAP explainer (use TreeExplainer for gradient boosting)
            self.explainer = shap.TreeExplainer(model)
    
    def explain_prediction_shap(self, cafe_data: Dict[str, Any],
                               advertiser_data: Dict[str, Any],
                               suburb_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Explain a prediction using SHAP values
        
        Args:
            cafe_data: Cafe information
            advertiser_data: Advertiser information
            suburb_data: Optional suburb demographic data
        
        Returns:
            Dictionary with SHAP values and explanation
        """
        if not SHAP_AVAILABLE:
            return {
                'error': 'SHAP not available',
                'message': 'Install shap package for detailed explanations'
            }
        
        # Extract features
        features = extract_features(cafe_data, advertiser_data, suburb_data)
        X = features_to_array(features).reshape(1, -1)
        X_scaled = self.scaler.transform(X)
        
        # Get SHAP values
        shap_values = self.explainer.shap_values(X_scaled)
        
        # Get base value (expected value)
        base_value = self.explainer.expected_value
        
        # Get prediction
        prediction = self.model.predict(X_scaled)[0]
        
        # Create feature contributions
        contributions = []
        for i, (name, shap_val) in enumerate(zip(self.feature_names_list, shap_values[0])):
            contributions.append({
                'feature': name,
                'value': float(features[name]),
                'shap_value': float(shap_val),
                'impact': 'positive' if shap_val > 0 else 'negative',
                'abs_impact': abs(float(shap_val))
            })
        
        # Sort by absolute impact
        contributions.sort(key=lambda x: x['abs_impact'], reverse=True)
        
        return {
            'prediction': float(prediction),
            'base_value': float(base_value),
            'top_positive_factors': [c for c in contributions if c['impact'] == 'positive'][:5],
            'top_negative_factors': [c for c in contributions if c['impact'] == 'negative'][:5],
            'all_contributions': contributions
        }
    
    def explain_with_importance(self, cafe_data: Dict[str, Any],
                               advertiser_data: Dict[str, Any],
                               suburb_data: Optional[Dict[str, Any]] = None,
                               top_n: int = 10) -> Dict[str, Any]:
        """
        Explain prediction using feature importance (fallback when SHAP unavailable)
        
        Args:
            cafe_data: Cafe information
            advertiser_data: Advertiser information
            suburb_data: Optional suburb data
            top_n: Number of top features to show
        
        Returns:
            Dictionary with explanation
        """
        # Extract features
        features = extract_features(cafe_data, advertiser_data, suburb_data)
        X = features_to_array(features).reshape(1, -1)
        X_scaled = self.scaler.transform(X)
        
        # Get prediction
        prediction = self.model.predict(X_scaled)[0]
        
        # Get feature importances
        importances = self.model.feature_importances_
        
        # Calculate contributions (feature_value * importance)
        contributions = []
        for i, name in enumerate(self.feature_names_list):
            feat_value = features[name]
            importance = importances[i]
            contribution = feat_value * importance
            
            contributions.append({
                'feature': name,
                'value': round(float(feat_value), 3),
                'importance': round(float(importance), 4),
                'contribution': round(float(contribution), 4),
                'abs_contribution': abs(contribution)
            })
        
        # Sort by absolute contribution
        contributions.sort(key=lambda x: x['abs_contribution'], reverse=True)
        
        # Separate positive and negative
        positive = [c for c in contributions if c['contribution'] > 0][:5]
        negative = [c for c in contributions if c['contribution'] < 0][:5]
        
        return {
            'prediction': round(float(prediction), 2),
            'method': 'feature_importance',
            'top_positive_factors': positive,
            'top_negative_factors': negative,
            'top_features': contributions[:top_n]
        }
    
    def generate_human_explanation(self, cafe_data: Dict[str, Any],
                                   advertiser_data: Dict[str, Any],
                                   suburb_data: Optional[Dict[str, Any]] = None) -> str:
        """
        Generate human-readable explanation of the prediction
        
        Returns:
            Natural language explanation string
        """
        # Get explanation data
        if SHAP_AVAILABLE:
            explanation = self.explain_prediction_shap(cafe_data, advertiser_data, suburb_data)
            prediction = explanation['prediction']
            top_positive = explanation['top_positive_factors']
            top_negative = explanation['top_negative_factors']
        else:
            explanation = self.explain_with_importance(cafe_data, advertiser_data, suburb_data)
            prediction = explanation['prediction']
            top_positive = explanation['top_positive_factors']
            top_negative = explanation['top_negative_factors']
        
        # Build explanation
        lines = [
            f"Predicted QR scan rate: {prediction:.2f} scans per 100 impressions\n",
            "Key factors contributing to this prediction:\n"
        ]
        
        # Positive factors
        if top_positive:
            lines.append("✓ Positive factors:")
            for factor in top_positive[:3]:
                feat_name = factor['feature'].replace('_', ' ').title()
                lines.append(f"  • {feat_name}: {factor['value']:.2f}")
        
        # Negative factors
        if top_negative:
            lines.append("\n✗ Negative factors:")
            for factor in top_negative[:3]:
                feat_name = factor['feature'].replace('_', ' ').title()
                lines.append(f"  • {feat_name}: {factor['value']:.2f}")
        
        # Add interpretation
        lines.append(f"\nInterpretation:")
        if prediction >= 4.0:
            lines.append("  This is a STRONG match - expect high engagement!")
        elif prediction >= 3.0:
            lines.append("  This is a GOOD match - expect solid engagement.")
        elif prediction >= 2.0:
            lines.append("  This is a MODERATE match - engagement may vary.")
        else:
            lines.append("  This is a WEAK match - consider other options.")
        
        return '\n'.join(lines)


def create_explainer(model, scaler):
    """
    Factory function to create ModelExplainer
    
    Args:
        model: Trained sklearn model
        scaler: Fitted StandardScaler
    
    Returns:
        ModelExplainer instance
    """
    return ModelExplainer(model, scaler, feature_names())


# Feature name to human-readable description mapping
FEATURE_DESCRIPTIONS = {
    'foot_traffic_norm': 'Foot traffic relative to average cafe',
    'packaging_volume_norm': 'Daily cup volume relative to average cafe',
    'impression_score': 'Combined impression potential',
    'distance_km': 'Distance from advertiser target location',
    'distance_norm': 'Proximity to target (normalized)',
    'suburb_match': 'Located in target suburb',
    'postcode_match': 'Located in target postcode',
    'within_radius': 'Within advertiser target radius',
    'age_match': 'Customer age matches target demographic',
    'income_match': 'Customer income matches target demographic',
    'population_density': 'Suburb population density',
    'tag_relevance': 'Cafe characteristics align with industry',
    'num_tags': 'Number of cafe characteristic tags',
    'location_volume_synergy': 'Location quality × impression volume',
    'demo_relevance_synergy': 'Demographics × industry relevance',
    'perfect_match': 'All targeting criteria perfectly met',
}


def get_feature_description(feature_name: str) -> str:
    """Get human-readable description of a feature"""
    # Handle industry features
    if feature_name.startswith('industry_'):
        return f"Industry category {feature_name.split('_')[1]}"
    
    return FEATURE_DESCRIPTIONS.get(feature_name, feature_name.replace('_', ' ').title())


if __name__ == '__main__':
    # Test explainability
    from model import MatchingModel
    
    print("Testing Model Explainability\n")
    
    # Load model
    try:
        model = MatchingModel()
        model.load()
    except FileNotFoundError:
        print("No trained model found. Train a model first with:")
        print("  python model.py --train")
        exit(1)
    
    # Create explainer
    explainer = create_explainer(model.model, model.scaler)
    
    # Test data
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
    
    # Generate explanation
    print("Human-readable explanation:")
    print("=" * 60)
    explanation_text = explainer.generate_human_explanation(test_cafe, test_advertiser, test_suburb)
    print(explanation_text)
    
    # Detailed explanation
    if SHAP_AVAILABLE:
        print("\n\nDetailed SHAP explanation:")
        print("=" * 60)
        shap_explanation = explainer.explain_prediction_shap(test_cafe, test_advertiser, test_suburb)
        print(f"Prediction: {shap_explanation['prediction']:.2f}")
        print(f"Base value: {shap_explanation['base_value']:.2f}")
        print(f"\nTop positive factors:")
        for factor in shap_explanation['top_positive_factors'][:5]:
            desc = get_feature_description(factor['feature'])
            print(f"  {desc}: +{factor['shap_value']:.3f}")
    else:
        print("\n\nFeature importance explanation:")
        print("=" * 60)
        imp_explanation = explainer.explain_with_importance(test_cafe, test_advertiser, test_suburb)
        print(f"Prediction: {imp_explanation['prediction']:.2f}")
        print(f"\nTop contributing features:")
        for factor in imp_explanation['top_features'][:5]:
            desc = get_feature_description(factor['feature'])
            print(f"  {desc}: {factor['contribution']:.3f}")
