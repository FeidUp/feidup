// FeidUp CRM + Location Backend - Main Entry Point
import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/auth.routes.js';
import { advertiserRoutes } from './routes/advertiser.routes.js';
import { cafeRoutes } from './routes/cafe.routes.js';
import { recommendationRoutes } from './routes/recommendation.routes.js';
import { campaignRoutes } from './routes/campaign.routes.js';
import { healthRoutes } from './routes/health.routes.js';
import { leadRoutes } from './routes/lead.routes.js';
import { inventoryRoutes } from './routes/inventory.routes.js';
import { analyticsRoutes } from './routes/analytics.routes.js';
import { assetRoutes } from './routes/asset.routes.js';
import { qrRedirectRoutes, qrAnalyticsRoutes } from './routes/qr.routes.js';
import { enrichmentRoutes } from './routes/enrichment.routes.js';
import mlRoutes from './routes/ml.routes.js';

const app = express();
const PORT = config.port;

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// Root route
app.get('/', (_req, res) => {
  res.json({ service: 'feidup-location-backend', status: 'ok', docs: '/health' });
});

// Routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/advertisers', advertiserRoutes);
app.use('/api/cafes', cafeRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/assets', assetRoutes);
app.use('/qr', qrRedirectRoutes);
app.use('/api/analytics', qrAnalyticsRoutes);
app.use('/api/enrichment', enrichmentRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 FeidUp CRM + Location Backend                        ║
║   Sales CRM & Advertising Matching Engine                 ║
║                                                           ║
║   Server running on: http://localhost:${PORT}               ║
║   Health check:      http://localhost:${PORT}/health        ║
║                                                           ║
║   API Endpoints:                                          ║
║   • POST /api/auth/login       - Login                    ║
║   • GET  /api/auth/me          - Current user             ║
║   • POST /api/auth/users       - Create user              ║
║   • CRUD /api/leads            - CRM Lead management      ║
║   • CRUD /api/advertisers      - Advertiser management    ║
║   • CRUD /api/cafes            - Restaurant management    ║
║   • GET  /api/recommendations  - Matching engine          ║
║   • CRUD /api/campaigns        - Campaign management      ║
║   • CRUD /api/inventory        - Packaging inventory      ║
║   • GET  /api/analytics/*      - Analytics & metrics      ║
║   • POST /api/assets/upload    - File uploads             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
