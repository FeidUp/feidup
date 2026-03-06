// Environment configuration
export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'feidup-dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // File uploads
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  
  // Google Maps (optional)
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  
  // Matching engine weights (can be tuned)
  matching: {
    weights: {
      location: 0.40,
      volume: 0.30,
      demographic: 0.20,
      relevance: 0.10,
    },
    defaultRadiusKm: 10,
    maxRecommendations: 20,
    distanceDecayFactor: 1.5,
  },
  
  // Scoring thresholds
  scoring: {
    excellent: 80,
    good: 60,
    fair: 40,
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
  },
} as const;
