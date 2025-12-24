// Environment configuration
export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  
  // Google Maps (optional)
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  
  // Matching engine weights (can be tuned)
  matching: {
    weights: {
      location: 0.40,      // 40% - Distance/suburb match
      volume: 0.30,        // 30% - Foot traffic & packaging volume  
      demographic: 0.20,   // 20% - Audience match
      relevance: 0.10,     // 10% - Industry/interest alignment
    },
    
    // Default radius for recommendations (km)
    defaultRadiusKm: 10,
    
    // Maximum cafes to return
    maxRecommendations: 20,
    
    // Distance decay factor (higher = sharper dropoff)
    distanceDecayFactor: 1.5,
  },
  
  // Scoring thresholds
  scoring: {
    excellent: 80,
    good: 60,
    fair: 40,
  },
} as const;
