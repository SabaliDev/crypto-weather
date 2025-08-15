const express = require('express');
const { CryptoCacheService } = require('../services/crypto-cache');

const router = express.Router();
const cryptoCache = new CryptoCacheService();

function generateWeatherForecast(price, change24h) {
  const weather = change24h > 5 ? '🚀' : 
                 change24h > 2 ? '☀️' : 
                 change24h > 0 ? '🌤️' : 
                 change24h > -2 ? '☁️' : 
                 change24h > -5 ? '🌧️' : '⛈️';
  
  const forecast = [];
  let basePrice = price;
  
  for (let i = 0; i < 5; i++) {
    const dayNames = ['Today', 'Tomorrow', 'In 2 Days', 'In 3 Days', 'In 4 Days'];
    const variation = (Math.random() - 0.5) * 0.1;
    basePrice *= (1 + variation);
    
    const dayChange = variation * 100;
    const dayWeather = dayChange > 5 ? '🚀' : 
                      dayChange > 2 ? '☀️' : 
                      dayChange > 0 ? '🌤️' : 
                      dayChange > -2 ? '☁️' : 
                      dayChange > -5 ? '🌧️' : '⛈️';
    
    forecast.push({
      day: dayNames[i],
      price: Math.round(basePrice * 100) / 100,
      weather: dayWeather
    });
  }
  
  return { weather, forecast };
}

// GET /api/crypto/single?coin=bitcoin
router.get('/single', async (req, res) => {
  const coin = req.query.coin || 'bitcoin';
  const forceRefresh = req.query.refresh === 'true';

  try {
    let cryptoData = await cryptoCache.getCrypto(coin, forceRefresh);
    
    if (!cryptoData) {
      // Provide fallback data for Bitcoin if API fails
      if (coin === 'bitcoin') {
        cryptoData = {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 45000,
          price_change_percentage_24h: 2.5,
          market_cap: 850000000000,
          market_cap_rank: 1,
          last_updated: new Date().toISOString()
        };
      } else {
        return res.status(404).json({
          error: 'Cryptocurrency not found'
        });
      }
    }

    const { weather, forecast } = generateWeatherForecast(
      cryptoData.current_price || 0,
      cryptoData.price_change_percentage_24h || 0
    );

    res.json({
      success: true,
      data: {
        id: cryptoData.id,
        symbol: cryptoData.symbol,
        name: cryptoData.name,
        price: cryptoData.current_price,
        change24h: cryptoData.price_change_percentage_24h,
        volume: cryptoData.market_cap,
        marketCap: cryptoData.market_cap,
        weather,
        forecast,
        last_updated: cryptoData.last_updated
      }
    });
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    res.status(500).json({
      error: 'Failed to fetch cryptocurrency data'
    });
  }
});

// GET /api/crypto/popular
router.get('/popular', async (req, res) => {
  try {
    const popularCryptos = await cryptoCache.getPopularCryptos();
    
    // If no cached data, fetch fresh data from API
    if (popularCryptos.length === 0) {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h'
        );
        
        if (response.ok) {
          const freshData = await response.json();
          
          // Cache each crypto
          for (const crypto of freshData) {
            try {
              await cryptoCache.cacheCrypto(crypto);
            } catch (cacheError) {
              console.error('Error caching crypto:', cacheError);
            }
          }
          
          const formattedData = freshData.map(crypto => ({
            id: crypto.id,
            symbol: crypto.symbol,
            name: crypto.name,
            price: crypto.current_price,
            change24h: crypto.price_change_percentage_24h,
            market_cap: crypto.market_cap,
            market_cap_rank: crypto.market_cap_rank
          }));
          
          return res.json({
            success: true,
            data: formattedData
          });
        }
      } catch (apiError) {
        console.error('Error fetching from CoinGecko API:', apiError);
      }
    }

    const formattedData = popularCryptos.map(crypto => ({
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      price: crypto.current_price,
      change24h: crypto.price_change_percentage_24h,
      market_cap: crypto.market_cap,
      market_cap_rank: crypto.market_cap_rank
    }));

    res.json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Error fetching popular cryptos:', error);
    res.status(500).json({
      error: 'Failed to fetch popular cryptocurrencies'
    });
  }
});

// GET /api/crypto/history?cryptoId=bitcoin&limit=100
router.get('/history', async (req, res) => {
  const cryptoId = req.query.cryptoId;
  const limit = parseInt(req.query.limit) || 100;

  if (!cryptoId) {
    return res.status(400).json({
      error: 'cryptoId parameter is required'
    });
  }

  try {
    const history = await cryptoCache.getCryptoHistory(cryptoId, limit);
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching crypto history:', error);
    res.status(500).json({
      error: 'Failed to fetch cryptocurrency history'
    });
  }
});

module.exports = router;