"""
Synthetic Training Data Generator

Generates realistic training samples for the ML model by simulating
cafe-advertiser placements and their expected outcomes based on
domain knowledge and the existing rule-based scoring system.
"""
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Tuple
import json
from features import extract_features, features_to_array, feature_names
from config import SYNTHETIC_DATA_CONFIG


# Industry-specific base scan rates (scans per 100 impressions)
INDUSTRY_BASE_RATES = {
    'fitness': 3.5,      # High engagement (local service)
    'food': 4.2,         # Very high engagement (immediate need)
    'education': 2.8,    # Medium engagement (considered decision)
    'health': 3.2,       # Medium-high engagement
    'beauty': 3.0,       # Medium engagement
    'technology': 2.5,   # Lower engagement (B2B often)
    'retail': 3.8,       # High engagement (shopping)
    'fintech': 2.2,      # Lower engagement (trust barrier)
    'arts_culture': 2.6, # Medium engagement
    'other': 2.5,        # Baseline
}


def load_sample_data() -> Tuple[List[Dict], List[Dict], Dict[str, Dict]]:
    """
    Load sample cafe, advertiser, and suburb data
    In production, this would query from the database
    """
    
    # Sample cafes (based on seed data)
    cafes = [
        {'id': '1', 'name': 'Central Perk Coffee', 'lat': -27.4698, 'lng': 153.0251, 'suburb': 'Brisbane City', 
         'postcode': '4000', 'avgDailyFootTraffic': 800, 'packagingVolume': 450, 
         'tags': ['cbd', 'business', 'high-traffic']},
        {'id': '2', 'name': 'Brunswick Street Beans', 'lat': -27.4573, 'lng': 153.0455, 'suburb': 'New Farm', 
         'postcode': '4005', 'avgDailyFootTraffic': 420, 'packagingVolume': 280, 
         'tags': ['brunch', 'trendy', 'instagram']},
        {'id': '3', 'name': 'West End Local', 'lat': -27.4836, 'lng': 153.0077, 'suburb': 'West End', 
         'postcode': '4101', 'avgDailyFootTraffic': 350, 'packagingVolume': 220, 
         'tags': ['organic', 'sustainability', 'community']},
        {'id': '4', 'name': 'Fitness Hub Cafe', 'lat': -27.4547, 'lng': 153.0050, 'suburb': 'Red Hill', 
         'postcode': '4059', 'avgDailyFootTraffic': 300, 'packagingVolume': 180, 
         'tags': ['fitness', 'health', 'smoothies']},
        {'id': '5', 'name': 'Student Commons', 'lat': -27.4977, 'lng': 153.0013, 'suburb': 'St Lucia', 
         'postcode': '4067', 'avgDailyFootTraffic': 650, 'packagingVolume': 400, 
         'tags': ['student', 'university', 'budget']},
        {'id': '6', 'name': 'Premium Brew Bar', 'lat': -27.4193, 'lng': 153.0575, 'suburb': 'Clayfield', 
         'postcode': '4011', 'avgDailyFootTraffic': 280, 'packagingVolume': 160, 
         'tags': ['premium', 'specialty', 'quiet']},
        {'id': '7', 'name': 'Beach Vibes Cafe', 'lat': -28.0027, 'lng': 153.4300, 'suburb': 'Surfers Paradise', 
         'postcode': '4217', 'avgDailyFootTraffic': 500, 'packagingVolume': 320, 
         'tags': ['beach', 'tourism', 'casual']},
        {'id': '8', 'name': 'Tech Hub Coffee', 'lat': -27.4482, 'lng': 153.0448, 'suburb': 'Newstead', 
         'postcode': '4006', 'avgDailyFootTraffic': 380, 'packagingVolume': 250, 
         'tags': ['coworking', 'tech', 'modern']},
    ]
    
    # Sample advertisers (various industries and targeting)
    advertisers = [
        {'id': 'adv1', 'industry': 'fitness', 'targetLat': -27.4698, 'targetLng': 153.0251, 
         'targetSuburbs': ['Brisbane City', 'New Farm', 'Fortitude Valley'], 'targetPostcodes': ['4000', '4005', '4006'],
         'targetRadiusKm': 5, 'targetAudience': {'ageRange': {'min': 22, 'max': 40}, 'incomeLevel': 'medium-high'}},
        
        {'id': 'adv2', 'industry': 'education', 'targetLat': -27.4977, 'targetLng': 153.0013,
         'targetSuburbs': ['St Lucia', 'Toowong', 'Taringa'], 'targetPostcodes': ['4067', '4066', '4068'],
         'targetRadiusKm': 3, 'targetAudience': {'ageRange': {'min': 18, 'max': 25}, 'incomeLevel': 'low-medium'}},
        
        {'id': 'adv3', 'industry': 'fintech', 'targetLat': -27.4698, 'targetLng': 153.0251,
         'targetSuburbs': ['Brisbane City', 'Spring Hill'], 'targetPostcodes': ['4000'],
         'targetRadiusKm': 2, 'targetAudience': {'ageRange': {'min': 28, 'max': 50}, 'incomeLevel': 'high'}},
        
        {'id': 'adv4', 'industry': 'food', 'targetLat': -27.4836, 'targetLng': 153.0077,
         'targetSuburbs': ['West End', 'South Brisbane', 'Highgate Hill'], 'targetPostcodes': ['4101'],
         'targetRadiusKm': 4, 'targetAudience': {'ageRange': {'min': 25, 'max': 45}, 'incomeLevel': 'medium'}},
        
        {'id': 'adv5', 'industry': 'retail', 'targetLat': -28.0027, 'targetLng': 153.4300,
         'targetSuburbs': ['Surfers Paradise', 'Broadbeach'], 'targetPostcodes': ['4217', '4218'],
         'targetRadiusKm': 3, 'targetAudience': {'ageRange': {'min': 20, 'max': 35}, 'incomeLevel': 'medium'}},
        
        {'id': 'adv6', 'industry': 'technology', 'targetLat': -27.4482, 'targetLng': 153.0448,
         'targetSuburbs': ['Newstead', 'Teneriffe', 'Fortitude Valley'], 'targetPostcodes': ['4005', '4006'],
         'targetRadiusKm': 4, 'targetAudience': {'ageRange': {'min': 25, 'max': 40}, 'incomeLevel': 'medium-high'}},
    ]
    
    # Sample suburb data (ABS Census)
    suburbs = {
        'Brisbane City': {'medianAge': 32, 'medianIncome': 85000, 'population': 12486},
        'New Farm': {'medianAge': 35, 'medianIncome': 78000, 'population': 12822},
        'West End': {'medianAge': 34, 'medianIncome': 62000, 'population': 11234},
        'Red Hill': {'medianAge': 35, 'medianIncome': 72000, 'population': 5400},
        'St Lucia': {'medianAge': 24, 'medianIncome': 28000, 'population': 11834},
        'Clayfield': {'medianAge': 36, 'medianIncome': 95000, 'population': 7800},
        'Surfers Paradise': {'medianAge': 34, 'medianIncome': 55000, 'population': 23200},
        'Newstead': {'medianAge': 33, 'medianIncome': 80000, 'population': 4800},
    }
    
    return cafes, advertisers, suburbs


def calculate_expected_scan_rate(features: Dict[str, float], industry: str) -> float:
    """
    Calculate expected QR scan rate based on features and domain knowledge
    
    This simulates what we expect to see in real data:
    - Base rate depends on industry
    - Modified by location quality, demographics, relevance
    - Some noise to simulate real-world variance
    """
    base_rate = INDUSTRY_BASE_RATES.get(industry, 2.5)
    
    # Location multiplier (0.5 - 1.5x)
    location_mult = 0.5 + (features['distance_norm'] * 0.5) + (features['suburb_match'] * 0.3) + (features['within_radius'] * 0.2)
    
    # Volume multiplier (0.7 - 1.3x) - high volume cafes perform slightly better
    volume_mult = 0.7 + (features['impression_score'] * 0.6)
    
    # Demographic multiplier (0.6 - 1.4x)
    demo_mult = 0.6 + (features['age_match'] * 0.4) + (features['income_match'] * 0.4)
    
    # Relevance multiplier (0.8 - 1.2x)
    relevance_mult = 0.8 + (features['tag_relevance'] * 0.4)
    
    # Perfect match bonus
    perfect_bonus = 1.3 if features['perfect_match'] == 1.0 else 1.0
    
    # Calculate expected rate
    expected_rate = base_rate * location_mult * volume_mult * demo_mult * relevance_mult * perfect_bonus
    
    # Clamp to realistic range (0.5 - 8.0 scans per 100 impressions)
    return np.clip(expected_rate, 0.5, 8.0)


def generate_synthetic_data(n_samples: int = None) -> pd.DataFrame:
    """
    Generate synthetic training data
    
    Args:
        n_samples: Number of samples to generate (default from config)
    
    Returns:
        DataFrame with features and target (scan_rate)
    """
    if n_samples is None:
        n_samples = SYNTHETIC_DATA_CONFIG['n_samples']
    
    cafes, advertisers, suburbs = load_sample_data()
    
    samples = []
    
    # Generate samples by pairing cafes with advertisers
    np.random.seed(42)  # For reproducibility
    
    for _ in range(n_samples):
        # Randomly select cafe and advertiser
        cafe = np.random.choice(cafes)
        advertiser = np.random.choice(advertisers)
        
        # Get suburb data
        suburb_data = suburbs.get(cafe['suburb'])
        
        # Extract features
        features = extract_features(cafe, advertiser, suburb_data)
        
        # Calculate expected scan rate
        base_scan_rate = calculate_expected_scan_rate(features, advertiser['industry'])
        
        # Add noise to simulate real-world variance
        noise_level = SYNTHETIC_DATA_CONFIG['noise_level']
        noise = np.random.normal(0, base_scan_rate * noise_level)
        scan_rate = max(0.1, base_scan_rate + noise)  # Minimum 0.1 to avoid zero
        
        # Create sample
        sample = {
            'cafe_id': cafe['id'],
            'advertiser_id': advertiser['id'],
            'scan_rate': scan_rate,
            **features
        }
        samples.append(sample)
    
    df = pd.DataFrame(samples)
    
    # Add some variety - duplicate with variations
    # This helps the model learn edge cases
    for _ in range(n_samples // 5):  # 20% additional varied samples
        base_sample = samples[np.random.randint(0, len(samples))]
        varied_sample = base_sample.copy()
        
        # Randomly vary some features
        vary_features = ['foot_traffic_norm', 'packaging_volume_norm', 'distance_km', 'tag_relevance']
        for feat in vary_features:
            if np.random.random() < 0.3:  # 30% chance to vary each
                varied_sample[feat] *= np.random.uniform(0.8, 1.2)
        
        # Recalculate scan rate
        varied_features = {k: v for k, v in varied_sample.items() if k not in ['cafe_id', 'advertiser_id', 'scan_rate']}
        industry = 'fitness'  # Default for varied samples
        base_rate = calculate_expected_scan_rate(varied_features, industry)
        noise = np.random.normal(0, base_rate * noise_level)
        varied_sample['scan_rate'] = max(0.1, base_rate + noise)
        
        samples.append(varied_sample)
    
    df = pd.DataFrame(samples)
    
    print(f"Generated {len(df)} synthetic training samples")
    print(f"Scan rate statistics:")
    print(f"  Mean: {df['scan_rate'].mean():.2f} scans/100 impressions")
    print(f"  Std: {df['scan_rate'].std():.2f}")
    print(f"  Min: {df['scan_rate'].min():.2f}")
    print(f"  Max: {df['scan_rate'].max():.2f}")
    
    return df


def save_training_data(df: pd.DataFrame, filepath: str = 'models/training_data.csv'):
    """Save generated training data to CSV"""
    df.to_csv(filepath, index=False)
    print(f"Training data saved to {filepath}")


if __name__ == '__main__':
    # Generate and save synthetic training data
    df = generate_synthetic_data()
    save_training_data(df)
    
    # Show sample
    print("\nSample data:")
    print(df.head())
    
    # Show feature distribution
    print("\nFeature value ranges:")
    feature_cols = [col for col in df.columns if col not in ['cafe_id', 'advertiser_id', 'scan_rate']]
    for col in feature_cols[:10]:  # Show first 10 features
        print(f"  {col}: {df[col].min():.3f} - {df[col].max():.3f}")
