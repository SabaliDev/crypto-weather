const express = require('express');
const { CryptoCacheService } = require('../services/crypto-cache');

const router = express.Router();
const cryptoCache = new CryptoCacheService();

// GET /api/regional?analysis=true
router.get('/', async (req, res) => {
  const includeAnalysis = req.query.analysis === 'true';

  try {
    const regionalData = await generateRegionalData(includeAnalysis);
    
    res.json({
      success: true,
      data: regionalData
    });
  } catch (error) {
    console.error('Error generating regional data:', error);
    res.status(500).json({
      error: 'Failed to generate regional data'
    });
  }
});

// POST /api/regional - AI Query endpoint
router.post('/', async (req, res) => {
  const { query, region } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({
      error: 'Query is required'
    });
  }

  try {
    const response = await processAIQuery(query, region);
    
    res.json({
      success: true,
      data: {
        query: query.trim(),
        response,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error processing AI query:', error);
    res.status(500).json({
      error: 'Failed to process query'
    });
  }
});

async function generateRegionalData(includeAnalysis) {
  // Get some popular crypto data for regions
  const popularCryptos = await cryptoCache.getPopularCryptos();
  
  const regions = [
    {
      region: 'asia-pacific',
      name: 'Asia-Pacific',
      icon: '🌅',
      condition: 'Early morning rally conditions',
      temperature: 28,
      humidity: 75,
      cryptoCorrelation: 'High positive correlation with tech sentiment',
      weather: {
        location: 'Singapore',
        temperature: 28,
        humidity: 75,
        pressure: 1013,
        windSpeed: 12,
        condition: 'Partly Cloudy',
        description: 'Warm and humid with light winds'
      },
      cryptoData: popularCryptos.slice(0, 5),
      analysis: includeAnalysis ? {
        weatherSentiment: 'Optimistic',
        marketSentiment: 'Bullish',
        confidenceScore: 78,
        correlation: 'Warm weather patterns correlate with increased trading activity in the region. High humidity suggests sustained momentum.',
        prediction: 'Expect continued upward pressure as Asian markets lead global sentiment.',
        volumeIndicator: 'High'
      } : null
    },
    {
      region: 'europe',
      name: 'Europe',
      icon: '☀️',
      condition: 'Sunny market outlook with strong fundamentals',
      temperature: 22,
      humidity: 60,
      cryptoCorrelation: 'Moderate correlation with regulatory sentiment',
      weather: {
        location: 'London',
        temperature: 22,
        humidity: 60,
        pressure: 1018,
        windSpeed: 8,
        condition: 'Sunny',
        description: 'Clear skies with comfortable conditions'
      },
      cryptoData: popularCryptos.slice(1, 6),
      analysis: includeAnalysis ? {
        weatherSentiment: 'Positive',
        marketSentiment: 'Bullish',
        confidenceScore: 85,
        correlation: 'Clear weather conditions align with regulatory clarity, boosting institutional confidence.',
        prediction: 'Stable growth expected with institutional backing.',
        volumeIndicator: 'Moderate'
      } : null
    },
    {
      region: 'americas',
      name: 'Americas',
      icon: '🌙',
      condition: 'Overnight consolidation with potential breakout',
      temperature: 18,
      humidity: 55,
      cryptoCorrelation: 'Strong correlation with US market sentiment',
      weather: {
        location: 'New York',
        temperature: 18,
        humidity: 55,
        pressure: 1015,
        windSpeed: 15,
        condition: 'Clear Night',
        description: 'Cool and clear with moderate winds'
      },
      cryptoData: popularCryptos.slice(2, 7),
      analysis: includeAnalysis ? {
        weatherSentiment: 'Neutral',
        marketSentiment: 'Neutral',
        confidenceScore: 65,
        correlation: 'Cool temperatures suggest cautious sentiment. Clear conditions favor strategic positioning.',
        prediction: 'Sideways movement expected with potential for morning breakout.',
        volumeIndicator: 'Low'
      } : null
    },
    {
      region: 'middle-east',
      name: 'Middle East',
      icon: '🌵',
      condition: 'Desert conditions with emerging opportunities',
      temperature: 35,
      humidity: 30,
      cryptoCorrelation: 'Growing correlation with energy markets',
      weather: {
        location: 'Dubai',
        temperature: 35,
        humidity: 30,
        pressure: 1008,
        windSpeed: 20,
        condition: 'Hot and Dry',
        description: 'Hot desert conditions with strong winds'
      },
      cryptoData: popularCryptos.slice(3, 8),
      analysis: includeAnalysis ? {
        weatherSentiment: 'Aggressive',
        marketSentiment: 'Bullish',
        confidenceScore: 72,
        correlation: 'Hot conditions drive energy demand, positively impacting blockchain and crypto mining sentiment.',
        prediction: 'Emerging market strength with energy sector backing.',
        volumeIndicator: 'Moderate'
      } : null
    }
  ];

  // Calculate global condition
  const avgConfidence = includeAnalysis ? 
    regions.reduce((sum, r) => sum + (r.analysis?.confidenceScore || 50), 0) / regions.length : 75;
  
  const bullishRegions = includeAnalysis ? 
    regions.filter(r => r.analysis?.marketSentiment === 'Bullish').length : 2;
  
  const globalTrend = bullishRegions >= 3 ? 'Strong Bullish' :
                     bullishRegions >= 2 ? 'Moderately Bullish' :
                     bullishRegions >= 1 ? 'Mixed Signals' : 'Bearish';

  const globalCondition = {
    overall: `Global crypto climate shows ${globalTrend.toLowerCase()} conditions across ${regions.length} major regions`,
    confidence: Math.round(avgConfidence),
    trend: globalTrend,
    timestamp: new Date().toISOString()
  };

  return {
    regions,
    globalCondition
  };
}

async function processAIQuery(query, region) {
  // Simple AI query processor - in a real app this would connect to an AI service
  const queryLower = query.toLowerCase();
  
  // Get some current crypto data for context
  const popularCryptos = await cryptoCache.getPopularCryptos();
  const bitcoin = await cryptoCache.getCrypto('bitcoin');
  const ethereum = await cryptoCache.getCrypto('ethereum');
  
  let response = '';
  
  // Detect query type and generate appropriate response
  if (queryLower.includes('weather') && queryLower.includes('crypto')) {
    response = `🌤️ Weather-crypto correlation analysis:\n\nBased on current market conditions, there's a moderate positive correlation between favorable weather patterns and crypto trading activity. Regions with stable, clear weather conditions (like Europe currently) tend to show more institutional trading activity, while areas with extreme weather (hot/cold) often see increased retail speculation.\n\nKey insights:\n• Clear weather ↔ Institutional confidence ↗️\n• Extreme weather ↔ Retail speculation ↗️\n• Rainy conditions ↔ Reduced trading activity ↘️`;
  }
  else if (queryLower.includes('price') || queryLower.includes('bitcoin') || queryLower.includes('ethereum')) {
    const btcPrice = bitcoin?.current_price || 45000;
    const ethPrice = ethereum?.current_price || 2800;
    const btcChange = bitcoin?.price_change_percentage_24h || 0;
    const ethChange = ethereum?.price_change_percentage_24h || 0;
    
    response = `💰 Current Price Analysis:\n\nBitcoin: $${btcPrice.toLocaleString()} (${btcChange > 0 ? '+' : ''}${btcChange.toFixed(2)}%)\nEthereum: $${ethPrice.toLocaleString()} (${ethChange > 0 ? '+' : ''}${ethChange.toFixed(2)}%)\n\nRegional Impact:\n• Asia-Pacific: Leading morning momentum\n• Europe: Strong institutional backing\n• Americas: Overnight consolidation\n• Middle East: Emerging market growth\n\nWeather correlation suggests ${btcChange > 0 ? 'favorable' : 'challenging'} conditions ahead.`;
  }
  else if (queryLower.includes('region') || queryLower.includes('asia') || queryLower.includes('europe') || queryLower.includes('america')) {
    const targetRegion = region || 'all regions';
    response = `🌍 Regional Analysis for ${targetRegion}:\n\n`;
    
    if (region === 'asia-pacific' || queryLower.includes('asia')) {
      response += `🌅 Asia-Pacific Overview:\n• Currently leading global sentiment with early morning rally\n• High correlation with tech sector performance\n• Weather: Warm and humid conditions supporting sustained activity\n• Trading Volume: High institutional and retail activity\n• Outlook: Bullish momentum expected to continue`;
    } else if (region === 'europe' || queryLower.includes('europe')) {
      response += `☀️ Europe Overview:\n• Sunny market conditions with strong regulatory clarity\n• Clear weather patterns align with institutional confidence\n• Trading Volume: Moderate but consistent institutional flows\n• Key Factor: Regulatory developments driving sentiment\n• Outlook: Stable growth with institutional backing`;
    } else if (region === 'americas' || queryLower.includes('america')) {
      response += `🌙 Americas Overview:\n• Overnight consolidation phase with strategic positioning\n• Cool conditions suggest cautious but optimistic sentiment\n• Trading Volume: Lower during night hours, building for morning\n• Key Factor: US market sentiment drives global direction\n• Outlook: Potential morning breakout anticipated`;
    } else {
      response += `Global sentiment shows mixed but generally positive conditions:\n• 2/4 regions showing bullish sentiment\n• Weather patterns support moderate trading activity\n• Institutional interest remains strong in developed markets\n• Emerging markets (Middle East) showing growth potential`;
    }
  }
  else if (queryLower.includes('trend') || queryLower.includes('forecast')) {
    response = `📈 Trend Forecast Analysis:\n\nShort-term (1-3 days):\n• Weather patterns suggest continued moderate volatility\n• Regional rotation from Asia → Europe → Americas showing healthy flow\n• Temperature differentials indicate energy sector correlation\n\nMedium-term (1-2 weeks):\n• Seasonal weather changes may impact trading patterns\n• Regional sentiment alignment suggests potential sustained moves\n• Correlation with traditional markets remains strong\n\nKey Factors:\n• Clear weather = Institutional confidence\n• Extreme temperatures = Retail speculation\n• Stable conditions = Continued growth trajectory`;
  }
  else {
    response = `🤖 AI Analysis:\n\nI've analyzed your query "${query}" in the context of current crypto-weather correlations.\n\nKey insights:\n• Global crypto sentiment: Moderately bullish\n• Weather correlation: Positive (clear conditions support trading)\n• Regional strength: Asia-Pacific leading, Europe stable\n• Volume indicators: Above average institutional activity\n\nFor more specific insights, try asking about:\n• Price movements and correlations\n• Regional market conditions\n• Weather impact on trading patterns\n• Trend forecasts and predictions\n\nRemember: This analysis is for educational purposes only and should not be considered financial advice.`;
  }
  
  return response;
}

module.exports = router;