"""
Feature Engineering for Cafe-Advertiser Matching

Extracts meaningful features from cafe and advertiser data to predict
placement success (QR scan rate).
"""
import numpy as np
from typing import Dict, List, Optional, Any
from config import FEATURE_CONFIG


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points on earth (in km)
    """
    # Convert to radians
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
    c = 2 * np.arcsin(np.sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
    return c * r


def calculate_age_overlap(cafe_age_range: tuple, target_age_range: tuple) -> float:
    """
    Calculate the overlap between two age ranges (0-1 scale)
    """
    cafe_min, cafe_max = cafe_age_range
    target_min, target_max = target_age_range
    
    overlap_min = max(cafe_min, target_min)
    overlap_max = min(cafe_max, target_max)
    
    if overlap_min > overlap_max:
        return 0.0
    
    overlap_range = overlap_max - overlap_min
    target_range = target_max - target_min
    
    return overlap_range / target_range if target_range > 0 else 0.0


def encode_industry(industry: str) -> List[int]:
    """
    One-hot encode industry categories
    """
    industries = ['fitness', 'education', 'fintech', 'food', 'arts_culture', 
                  'technology', 'retail', 'health', 'beauty', 'other']
    
    industry_lower = industry.lower()
    return [1 if ind == industry_lower else 0 for ind in industries]


def calculate_tag_relevance(cafe_tags: List[str], industry: str) -> float:
    """
    Calculate how relevant cafe tags are to the advertiser's industry
    """
    industry_tag_map = {
        'fitness': ['fitness', 'health', 'wellness', 'organic', 'active'],
        'education': ['student', 'university', 'study-friendly', 'academic', 'coworking-friendly'],
        'fintech': ['business', 'professional', 'cbd', 'premium', 'executive'],
        'food': ['organic', 'vegan-friendly', 'brunch', 'specialty', 'premium'],
        'arts_culture': ['cultural', 'museum', 'arts', 'creative', 'gallery'],
        'technology': ['coworking-friendly', 'trendy', 'startup', 'modern'],
        'retail': ['shopping', 'boutique', 'high-traffic', 'weekend'],
        'health': ['wellness', 'organic', 'health', 'fitness'],
        'beauty': ['boutique', 'premium', 'fashion', 'trendy'],
    }
    
    relevant_tags = industry_tag_map.get(industry.lower(), [])
    if not relevant_tags:
        return 0.0
    
    cafe_tags_lower = [tag.lower() for tag in cafe_tags]
    matches = sum(1 for tag in relevant_tags 
                  if any(tag in cafe_tag or cafe_tag in tag 
                        for cafe_tag in cafe_tags_lower))
    
    return min(1.0, matches / len(relevant_tags))


def extract_features(cafe_data: Dict[str, Any], advertiser_data: Dict[str, Any], 
                     suburb_data: Optional[Dict[str, Any]] = None) -> Dict[str, float]:
    """
    Extract all features for ML model prediction
    
    Args:
        cafe_data: Dictionary with cafe information
        advertiser_data: Dictionary with advertiser targeting info
        suburb_data: Optional ABS Census data for the suburb
    
    Returns:
        Dictionary of feature name -> value pairs
    """
    features = {}
    
    # === CAFE FEATURES ===
    
    # Normalized foot traffic (relative to baseline)
    avg_traffic = FEATURE_CONFIG['avg_foot_traffic']
    features['foot_traffic_norm'] = cafe_data.get('avgDailyFootTraffic', avg_traffic) / avg_traffic
    
    # Normalized packaging volume (relative to baseline)
    avg_volume = FEATURE_CONFIG['avg_packaging_volume']
    features['packaging_volume_norm'] = cafe_data.get('packagingVolume', avg_volume) / avg_volume
    
    # Combined impression potential
    features['impression_score'] = (features['foot_traffic_norm'] + features['packaging_volume_norm']) / 2
    
    # === LOCATION FEATURES ===
    
    # Distance from advertiser's target center
    if advertiser_data.get('targetLat') and advertiser_data.get('targetLng'):
        distance = haversine_distance(
            cafe_data['lat'], cafe_data['lng'],
            advertiser_data['targetLat'], advertiser_data['targetLng']
        )
        features['distance_km'] = distance
        
        # Normalized distance (0-1, where 1 is very close)
        max_dist = FEATURE_CONFIG['max_distance_km']
        features['distance_norm'] = max(0, 1 - (distance / max_dist))
    else:
        features['distance_km'] = 0
        features['distance_norm'] = 0.5  # Neutral when no target center
    
    # Suburb match (binary)
    target_suburbs = advertiser_data.get('targetSuburbs', [])
    features['suburb_match'] = 1.0 if cafe_data['suburb'] in target_suburbs else 0.0
    
    # Postcode match (binary)
    target_postcodes = advertiser_data.get('targetPostcodes', [])
    features['postcode_match'] = 1.0 if cafe_data['postcode'] in target_postcodes else 0.0
    
    # Within target radius
    target_radius = advertiser_data.get('targetRadiusKm', 10)
    features['within_radius'] = 1.0 if features['distance_km'] <= target_radius else 0.0
    
    # === DEMOGRAPHIC FEATURES ===
    
    # Age match (if available)
    if suburb_data and suburb_data.get('medianAge') and advertiser_data.get('targetAudience'):
        target_audience = advertiser_data['targetAudience']
        if 'ageRange' in target_audience:
            median_age = suburb_data['medianAge']
            age_range = target_audience['ageRange']
            
            # Check if median age is in target range
            if age_range['min'] <= median_age <= age_range['max']:
                features['age_match'] = 1.0
            else:
                # Partial match based on distance from range
                if median_age < age_range['min']:
                    distance = age_range['min'] - median_age
                else:
                    distance = median_age - age_range['max']
                features['age_match'] = max(0, 1 - (distance / 10))  # Decay over 10 years
        else:
            features['age_match'] = 0.5
    else:
        features['age_match'] = 0.5  # Neutral when unknown
    
    # Income match (if available)
    income_levels = {'low': 1, 'low-medium': 2, 'medium': 3, 'medium-high': 4, 'high': 5}
    
    if suburb_data and suburb_data.get('medianIncome') and advertiser_data.get('targetAudience'):
        median_income = suburb_data['medianIncome']
        
        # Classify income level
        if median_income < 35000:
            suburb_income_level = 1
        elif median_income < 50000:
            suburb_income_level = 2
        elif median_income < 65000:
            suburb_income_level = 3
        elif median_income < 85000:
            suburb_income_level = 4
        else:
            suburb_income_level = 5
        
        target_income = advertiser_data['targetAudience'].get('incomeLevel', 'medium')
        target_income_level = income_levels.get(target_income, 3)
        
        # Income match score (0-1, perfect match = 1, 2 levels off = 0)
        level_diff = abs(suburb_income_level - target_income_level)
        features['income_match'] = max(0, 1 - (level_diff / 4))
    else:
        features['income_match'] = 0.5  # Neutral when unknown
    
    # Population density (normalized)
    if suburb_data and suburb_data.get('population'):
        # Higher population = more potential reach
        features['population_density'] = min(1.0, suburb_data['population'] / 20000)
    else:
        features['population_density'] = 0.5
    
    # === RELEVANCE FEATURES ===
    
    # Industry-tag relevance
    cafe_tags = cafe_data.get('tags', [])
    industry = advertiser_data.get('industry', 'other')
    features['tag_relevance'] = calculate_tag_relevance(cafe_tags, industry)
    
    # Number of relevant tags
    features['num_tags'] = len(cafe_tags)
    
    # === INDUSTRY ONE-HOT ENCODING ===
    industry_encoded = encode_industry(industry)
    for i, val in enumerate(industry_encoded):
        features[f'industry_{i}'] = float(val)
    
    # === INTERACTION FEATURES ===
    
    # Location + Volume synergy (close + high volume = best)
    features['location_volume_synergy'] = features['distance_norm'] * features['impression_score']
    
    # Demographics + Relevance synergy
    features['demo_relevance_synergy'] = (
        (features['age_match'] + features['income_match']) / 2 * features['tag_relevance']
    )
    
    # Perfect match (all criteria met)
    features['perfect_match'] = float(
        features['suburb_match'] == 1.0 and
        features['age_match'] >= 0.8 and
        features['income_match'] >= 0.8 and
        features['tag_relevance'] >= 0.5
    )
    
    return features


def feature_names() -> List[str]:
    """
    Return list of all feature names in consistent order
    """
    base_features = [
        'foot_traffic_norm',
        'packaging_volume_norm',
        'impression_score',
        'distance_km',
        'distance_norm',
        'suburb_match',
        'postcode_match',
        'within_radius',
        'age_match',
        'income_match',
        'population_density',
        'tag_relevance',
        'num_tags',
    ]
    
    # Industry features (10 one-hot encoded)
    industry_features = [f'industry_{i}' for i in range(10)]
    
    interaction_features = [
        'location_volume_synergy',
        'demo_relevance_synergy',
        'perfect_match',
    ]
    
    return base_features + industry_features + interaction_features


def features_to_array(features: Dict[str, float]) -> np.ndarray:
    """
    Convert feature dictionary to numpy array in consistent order
    """
    names = feature_names()
    return np.array([features.get(name, 0.0) for name in names])


if __name__ == '__main__':
    # Test feature extraction
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
        'targetSuburbs': ['Brisbane City', 'Spring Hill'],
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
    
    features = extract_features(test_cafe, test_advertiser, test_suburb)
    
    print(f"Extracted {len(features)} features:")
    for name, value in sorted(features.items()):
        print(f"  {name}: {value:.3f}")
    
    print(f"\nFeature array shape: {features_to_array(features).shape}")
