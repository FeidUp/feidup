// FeidUp CRM + Location Backend - Main Entry Point
import app from './app.js';
import { config } from './config/index.js';

const PORT = config.port;

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
