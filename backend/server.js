require('dotenv').config();
const express = require('express');
const cors = require('cors');

const cryptoRoutes = require('./routes/crypto');
const forecastRoutes = require('./routes/forecast');
const regionalRoutes = require('./routes/regional');

const app = express();
const PORT = process.env.PORT || 8080; // Changed to match the .env file

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://crypto-weather-app-rho.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/crypto', cryptoRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/regional', regionalRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'crypto-weather-backend'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Crypto Weather Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 CORS enabled for frontend domains`);
});