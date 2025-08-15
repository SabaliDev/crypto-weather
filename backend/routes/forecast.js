const express = require('express');
const { CryptoCacheService } = require('../services/crypto-cache');

const router = express.Router();
const cryptoCache = new CryptoCacheService();

// GET /api/forecast?coin=bitcoin&confidence=moderate&mock=false
router.get('/', async (req, res) => {
  const coin = req.query.coin || 'bitcoin';
  const confidence = req.query.confidence || 'moderate';
  const useMockData = req.query.mock === 'true';

  try {
    // Get current crypto data
    let cryptoData = await cryptoCache.getCrypto(coin);
    
    if (!cryptoData) {
      // Fallback data
      cryptoData = {
        id: coin,
        symbol: coin === 'bitcoin' ? 'btc' : coin.substring(0, 3),
        name: coin.charAt(0).toUpperCase() + coin.slice(1),
        current_price: 45000,
        price_change_percentage_24h: 2.5,
        market_cap: 850000000000,
        market_cap_rank: 1,
        last_updated: new Date().toISOString()
      };
    }

    const currentPrice = cryptoData.current_price || 45000;
    const change24h = cryptoData.price_change_percentage_24h || 0;

    // Generate forecast data
    const forecastData = generateForecastData(cryptoData, confidence, useMockData);

    res.json({
      success: true,
      data: forecastData
    });
  } catch (error) {
    console.error('Error generating forecast:', error);
    res.status(500).json({
      error: 'Failed to generate forecast'
    });
  }
});

function generateForecastData(cryptoData, confidence, useMockData) {
  const currentPrice = cryptoData.current_price || 45000;
  const change24h = cryptoData.price_change_percentage_24h || 0;
  const symbol = cryptoData.symbol?.toUpperCase() || 'BTC';
  
  // Confidence level multipliers
  const confidenceMultipliers = {
    conservative: 0.5,
    moderate: 1.0,
    aggressive: 1.8
  };
  
  const multiplier = confidenceMultipliers[confidence] || 1.0;
  
  // Generate 5-day forecast
  const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'];
  let basePrice = currentPrice;
  
  const forecast = days.map((day, index) => {
    if (useMockData) {
      // Simple mock data generation
      const variation = (Math.random() - 0.5) * 0.15 * multiplier;
      basePrice *= (1 + variation);
      
      const volatility = Math.abs(variation) > 0.08 ? 'High' : 
                        Math.abs(variation) > 0.04 ? 'Medium' : 'Low';
      
      const weather = variation > 0.05 ? '🚀' : 
                     variation > 0.02 ? '☀️' : 
                     variation > -0.02 ? '🌤️' : 
                     variation > -0.05 ? '🌧️' : '⛈️';
      
      return {
        day,
        weather,
        btc: Math.round(basePrice),
        eth: Math.round(basePrice * 0.065), // Rough ETH/BTC ratio
        volatility,
        confidence: Math.round(85 - Math.abs(variation) * 200),
        priceRange: {
          low: Math.round(basePrice * 0.92),
          high: Math.round(basePrice * 1.08)
        }
      };
    } else {
      // Smart algorithm with technical analysis
      const variation = generateSmartVariation(index, change24h, multiplier);
      basePrice *= (1 + variation);
      
      const volatility = Math.abs(variation) > 0.1 ? 'High' : 
                        Math.abs(variation) > 0.05 ? 'Medium' : 'Low';
      
      const weather = variation > 0.08 ? '🚀' : 
                     variation > 0.03 ? '☀️' : 
                     variation > -0.03 ? '🌤️' : 
                     variation > -0.08 ? '🌧️' : '⛈️';
      
      return {
        day,
        weather,
        btc: Math.round(basePrice),
        eth: Math.round(basePrice * 0.065),
        volatility,
        confidence: Math.round(75 + Math.random() * 20),
        priceRange: {
          low: Math.round(basePrice * (0.85 + Math.random() * 0.1)),
          high: Math.round(basePrice * (1.05 + Math.random() * 0.1))
        }
      };
    }
  });

  // Generate technical indicators
  const technicals = generateTechnicals(currentPrice, change24h);
  
  // Generate sentiment data
  const sentiment = generateSentiment(change24h);
  
  // Generate alerts
  const alerts = generateAlerts(change24h, technicals.rsi);

  // Determine trend
  const avgChange = forecast.reduce((sum, day, i) => {
    if (i === 0) return sum;
    return sum + ((day.btc - forecast[i-1].btc) / forecast[i-1].btc);
  }, 0) / (forecast.length - 1);

  const trendDescription = avgChange > 0.05 ? 
    `🚀 Rocket fuel detected! ${symbol} shows strong bullish momentum with ${confidence} confidence signals.` :
    avgChange > 0.02 ? 
    `☀️ Sunny skies ahead for ${symbol} with moderate upward pressure and ${confidence} market sentiment.` :
    avgChange > -0.02 ? 
    `🌤️ Partly cloudy conditions for ${symbol}. Sideways movement expected with ${confidence} stability.` :
    avgChange > -0.05 ? 
    `🌧️ Storm clouds gathering for ${symbol}. Bearish pressure with ${confidence} downward signals.` :
    `⛈️ Severe weather warning! ${symbol} faces strong headwinds with ${confidence} bearish sentiment.`;

  return {
    weekly: {
      period: "5-Day Extended Forecast",
      trend: trendDescription,
      days: forecast
    },
    alerts,
    technicals,
    sentiment,
    coin: cryptoData.name,
    symbol: symbol,
    currentPrice: currentPrice,
    disclaimer: "This forecast is for entertainment purposes only and should not be considered financial advice. Cryptocurrency investments are highly volatile and you may lose your entire investment. Always do your own research and consult with a qualified financial advisor."
  };
}

function generateSmartVariation(dayIndex, currentChange, multiplier) {
  // Base trend from current momentum
  const momentumFactor = currentChange / 100 * 0.3;
  
  // Add some randomness with trend continuation
  const randomFactor = (Math.random() - 0.5) * 0.1;
  
  // Trend reversal probability increases over time
  const reversalProbability = dayIndex * 0.15;
  const shouldReverse = Math.random() < reversalProbability;
  
  let variation = momentumFactor + randomFactor;
  
  if (shouldReverse) {
    variation *= -0.5; // Partial reversal
  }
  
  return variation * multiplier;
}

function generateTechnicals(currentPrice, change24h) {
  const basePrice = currentPrice;
  
  return {
    ma7: basePrice * (0.98 + Math.random() * 0.04),
    ma14: basePrice * (0.96 + Math.random() * 0.08),
    ma30: basePrice * (0.92 + Math.random() * 0.16),
    rsi: Math.max(10, Math.min(90, 50 + change24h * 2 + (Math.random() - 0.5) * 30)),
    volatility: Math.abs(change24h) + Math.random() * 20,
    fearGreedIndex: Math.max(10, Math.min(90, 50 + change24h + (Math.random() - 0.5) * 40))
  };
}

function generateSentiment(change24h) {
  const baseSentiment = 50 + change24h;
  
  return {
    fearGreedIndex: Math.max(0, Math.min(100, baseSentiment + (Math.random() - 0.5) * 30)),
    globalSentiment: Math.max(0, Math.min(100, baseSentiment + (Math.random() - 0.5) * 20)),
    trendingSentiment: Math.max(0, Math.min(100, baseSentiment + (Math.random() - 0.5) * 25)),
    volumeSentiment: Math.max(0, Math.min(100, 60 + (Math.random() - 0.5) * 40)),
    coinSpecificSentiment: Math.max(0, Math.min(100, baseSentiment + (Math.random() - 0.5) * 35))
  };
}

function generateAlerts(change24h, rsi) {
  const alerts = [];
  
  if (rsi > 70) {
    alerts.push({
      type: "Overbought Signal",
      message: "RSI indicates potential selling pressure ahead",
      severity: "high",
      icon: "⚠️"
    });
  }
  
  if (rsi < 30) {
    alerts.push({
      type: "Oversold Signal", 
      message: "RSI suggests potential buying opportunity",
      severity: "medium",
      icon: "💡"
    });
  }
  
  if (Math.abs(change24h) > 10) {
    alerts.push({
      type: "High Volatility",
      message: "Extreme price movement detected in last 24h",
      severity: "high", 
      icon: "🌪️"
    });
  }
  
  if (change24h > 5) {
    alerts.push({
      type: "Bullish Momentum",
      message: "Strong upward price action continues",
      severity: "medium",
      icon: "🚀"
    });
  }
  
  if (alerts.length === 0) {
    alerts.push({
      type: "Stable Conditions",
      message: "Normal market conditions with moderate volatility",
      severity: "low",
      icon: "🌤️"
    });
  }
  
  return alerts;
}

module.exports = router;