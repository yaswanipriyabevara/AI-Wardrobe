require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { requireAuth } = require('./auth');
const { rateLimit, errorHandler } = require('./middleware');

const authRoutes = require('./routes/auth');
const wardrobeRoutes = require('./routes/wardrobe');
const profileRoutes = require('./routes/profile');
const weatherRoutes = require('./routes/weather');
const outfitRoutes = require('./routes/outfits');
const rateRoutes = require('./routes/rate');
const insightsRoutes = require('./routes/insights');
const { PROVIDER } = require('./services/aiService');
const { storageProvider } = require('./db');

const app = express();
const allowedOrigins = (process.env.FRONTEND_ORIGIN || '*').split(',').map((x) => x.trim());
app.use(cors({ origin: allowedOrigins.includes('*') ? '*' : allowedOrigins, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.disable('x-powered-by');
app.use(express.json({ limit: '8mb', strict: true }));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', aiProvider: PROVIDER, auth: 'jwt', storage: storageProvider }));
app.use('/api/auth', authRoutes);

// All application data endpoints require a signed JWT.
app.use('/api/wardrobe', requireAuth, wardrobeRoutes);
app.use('/api/profile', requireAuth, profileRoutes);
app.use('/api/weather', requireAuth, weatherRoutes);
app.use('/api/outfits', requireAuth, outfitRoutes);
app.use('/api/rate', requireAuth, rateRoutes);
app.use('/api/insights', requireAuth, insightsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`StyleSync API running on http://localhost:${PORT}`);
  console.log(`AI provider: ${PROVIDER}${PROVIDER === 'mock' ? ' (demo-safe fallback)' : ''}`);
});
