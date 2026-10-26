// FeidUp CRM + Location Backend - Express app (no listen, so tests can import it)
import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

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

const app = express();

// Render terminates TLS at a proxy; needed for real client IPs in rate limiting
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit on credential endpoints to slow brute forcing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.nodeEnv === 'test' ? 1000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many attempts, try again later' },
});

const allowedOrigins = new Set([
  ...config.frontendUrl.split(',').map((o) => o.trim()).filter(Boolean),
  ...(config.nodeEnv === 'production' ? [] : ['http://localhost:5173', 'http://localhost:5174']),
]);

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowedOrigins.has(origin)),
}));
app.use(express.json());
app.use(limiter);

// Root route
app.get('/', (_req, res) => {
  res.json({ service: 'feidup-location-backend', status: 'ok', docs: '/health' });
});

// Routes
app.use('/health', healthRoutes);
app.use(['/api/auth/login', '/api/auth/forgot-password', '/api/auth/reset-password'], authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/advertisers', advertiserRoutes);
app.use('/api/cafes', cafeRoutes);
app.use('/api/recommendations', recommendationRoutes);
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

export default app;
