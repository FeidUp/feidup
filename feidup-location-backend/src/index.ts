// FeidUp Location Backend - Main Entry Point
import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';

import { errorHandler } from './middleware/errorHandler.js';
import { advertiserRoutes } from './routes/advertiser.routes.js';
import { cafeRoutes } from './routes/cafe.routes.js';
import { recommendationRoutes } from './routes/recommendation.routes.js';
import { campaignRoutes } from './routes/campaign.routes.js';
import { healthRoutes } from './routes/health.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/health', healthRoutes);
app.use('/api/advertisers', advertiserRoutes);
app.use('/api/cafes', cafeRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/campaigns', campaignRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 FeidUp Location Backend                              ║
║   Location-Based Advertising Matching Engine              ║
║                                                           ║
║   Server running on: http://localhost:${PORT}               ║
║   Health check:      http://localhost:${PORT}/health        ║
║                                                           ║
║   API Endpoints:                                          ║
║   • POST /api/advertisers      - Create advertiser        ║
║   • POST /api/cafes            - Create cafe              ║
║   • GET  /api/recommendations  - Get matched cafes        ║
║   • POST /api/campaigns        - Create campaign          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
