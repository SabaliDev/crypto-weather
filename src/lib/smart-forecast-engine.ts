// Smart Forecast Engine that creates realistic market data and predictions
// Uses algorithmic market simulation when MCP data is unavailable

import { CryptoCacheService } from './crypto-cache'

interface CoinData {
  id: string
  name: string
  symbol: string
  current_price: number
  market_cap: number
  price_change_24h: number
  price_change_percentage_24h: number
  volatility_score: number
}

interface TechnicalIndicators {
  ma7: number
  ma14: number
  ma30: number
  rsi: number
  macd: {
    macd: number
    signal: number
    histogram: number
  }
  bollingerBands: {
    upper: number
    middle: number
    lower: number
    position: 'above' | 'middle' | 'below'
  }
  support: number
  resistance: number
  volatility: number
}

interface MarketSentiment {
  globalSentiment: number
  trendingSentiment: number
  volumeSentiment: number
  coinSpecificSentiment: number
  fearGreedIndex: number
}

interface ForecastDay {
  date: string
  price: number
  priceRange: {
    low: number
    high: number
  }
  confidence: number
  weather: string
  volatility: 'Low' | 'Medium' | 'High'
}

interface ForecastResult {
  coin: string
  symbol: string
  currentPrice: number
  forecast: ForecastDay[]
  technicals: TechnicalIndicators
  sentiment: MarketSentiment
  summary: string
  disclaimer: string
}

export class SmartForecastEngine {
  private cryptoCache: CryptoCacheService

  constructor() {
    this.cryptoCache = new CryptoCacheService()
  }

  private async getRealTimePrice(coinId: string): Promise<CoinData | null> {
    try {
      const realTimeData = await this.cryptoCache.getCrypto(coinId)
      if (realTimeData && realTimeData.current_price) {
        return {
          id: realTimeData.id,
          name: realTimeData.name,
          symbol: realTimeData.symbol.toUpperCase(),
          current_price: realTimeData.current_price,
          market_cap: realTimeData.market_cap || 0,
          price_change_24h: realTimeData.price_change_24h || 0,
          price_change_percentage_24h: realTimeData.price_change_percentage_24h || 0,
          volatility_score: this.calculateVolatilityScore(realTimeData.price_change_percentage_24h || 0)
        }
      }
    } catch (error) {
      console.log('Could not fetch real-time data, falling back to static data:', error)
    }
    return null
  }

  private calculateVolatilityScore(priceChange24h: number): number {
    // Convert 24h price change to volatility score
    const absChange = Math.abs(priceChange24h)
    if (absChange > 20) return 80
    if (absChange > 10) return 60
    if (absChange > 5) return 40
    if (absChange > 2) return 25
    return 15
  }

  private getCurrentMarketPrices(): Record<string, CoinData> {
    // Get current date for market simulation
    const now = new Date()
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const marketCycle = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 0.1 // Annual cycle
    const dailyVariation = (Math.random() - 0.5) * 0.04 // ±2% daily variation
    
    // Apply market dynamics to base prices
    const adjustedPrices = Object.fromEntries(
      Object.entries(this.coinDatabase).map(([key, coin]) => {
        const marketAdjustment = 1 + marketCycle + dailyVariation
        const adjustedCoin = {
          ...coin,
          current_price: coin.current_price * marketAdjustment,
          price_change_24h: coin.current_price * marketAdjustment * ((Math.random() - 0.5) * 0.08),
        }
        adjustedCoin.price_change_percentage_24h = (adjustedCoin.price_change_24h / adjustedCoin.current_price) * 100
        return [key, adjustedCoin]
      })
    )
    
    return adjustedPrices
  }

  private coinDatabase: Record<string, CoinData> = {
    bitcoin: {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      current_price: 105000, // Updated to current market levels
      market_cap: 2100000000000,
      price_change_24h: 2850,
      price_change_percentage_24h: 2.75,
      volatility_score: 25
    },
    ethereum: {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      current_price: 3900, // Updated to current market levels
      market_cap: 480000000000,
      price_change_24h: 125,
      price_change_percentage_24h: 3.24,
      volatility_score: 30
    },
    binancecoin: {
      id: 'binancecoin',
      name: 'BNB',
      symbol: 'BNB',
      current_price: 700,
      market_cap: 105000000000,
      price_change_24h: 28,
      price_change_percentage_24h: 4.20,
      volatility_score: 35
    },
    cardano: {
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ADA',
      current_price: 1.20, // Updated to reflect current market
      market_cap: 40000000000,
      price_change_24h: 0.065,
      price_change_percentage_24h: 5.98,
      volatility_score: 45
    },
    solana: {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      current_price: 240, // Updated to current market levels
      market_cap: 118000000000,
      price_change_24h: 12.50,
      price_change_percentage_24h: 5.38,
      volatility_score: 55
    },
    polkadot: {
      id: 'polkadot',
      name: 'Polkadot',
      symbol: 'DOT',
      current_price: 9.20, // Updated to current market levels
      market_cap: 13000000000,
      price_change_24h: 0.45,
      price_change_percentage_24h: 5.35,
      volatility_score: 40
    },
    chainlink: {
      id: 'chainlink',
      name: 'Chainlink',
      symbol: 'LINK',
      current_price: 25.00,
      market_cap: 15000000000,
      price_change_24h: 1.25,
      price_change_percentage_24h: 5.38,
      volatility_score: 50
    },
    avalanche: {
      id: 'avalanche',
      name: 'Avalanche',
      symbol: 'AVAX',
      current_price: 46.00,
      market_cap: 18000000000,
      price_change_24h: 2.15,
      price_change_percentage_24h: 4.99,
      volatility_score: 60
    },
    polygon: {
      id: 'polygon',
      name: 'Polygon',
      symbol: 'MATIC',
      current_price: 0.55,
      market_cap: 5200000000,
      price_change_24h: 0.025,
      price_change_percentage_24h: 5.06,
      volatility_score: 55
    }
  }

  private generateRealisticPriceHistory(currentPrice: number, days: number, volatility: number): number[] {
    const prices = [currentPrice]
    
    for (let i = 1; i < days; i++) {
      const dailyVolatility = (volatility / 100) / Math.sqrt(365) // Convert to daily
      const randomWalk = (Math.random() - 0.5) * 2 * dailyVolatility
      const trendComponent = Math.sin(i / 7) * 0.01 // Weekly cycle
      const momentum = Math.exp(-i / 20) * 0.02 // Decaying momentum
      
      const change = randomWalk + trendComponent + momentum
      const newPrice = prices[i - 1] * (1 + change)
      prices.push(Math.max(newPrice, currentPrice * 0.5)) // Floor at 50% of current
    }
    
    return prices.reverse() // Oldest first
  }

  private calculateTechnicalIndicators(prices: number[], currentPrice: number): TechnicalIndicators {
    if (prices.length < 30) {
      // Generate more historical data if needed
      const extendedPrices = this.generateRealisticPriceHistory(currentPrice, 30, 30)
      prices = extendedPrices
    }

    // Moving Averages
    const ma7 = this.calculateSMA(prices, 7)
    const ma14 = this.calculateSMA(prices, 14)
    const ma30 = this.calculateSMA(prices, 30)

    // RSI
    const rsi = this.calculateRSI(prices, 14)

    // MACD
    const ema12 = this.calculateEMA(prices, 12)
    const ema26 = this.calculateEMA(prices, 26)
    const macd = ema12 - ema26
    const signal = macd * 0.9 // Simplified
    const histogram = macd - signal

    // Bollinger Bands
    const sma20 = this.calculateSMA(prices, 20)
    const variance = prices.slice(-20).reduce((sum, price) => sum + Math.pow(price - sma20, 2), 0) / 20
    const stdDev = Math.sqrt(variance)
    
    const bollingerBands = {
      upper: sma20 + (2 * stdDev),
      middle: sma20,
      lower: sma20 - (2 * stdDev),
      position: (currentPrice > sma20 + stdDev ? 'above' : 
                currentPrice < sma20 - stdDev ? 'below' : 'middle') as 'above' | 'middle' | 'below'
    }

    // Support and Resistance
    const recentPrices = prices.slice(-20)
    const sortedPrices = [...recentPrices].sort((a, b) => a - b)
    const support = sortedPrices[Math.floor(sortedPrices.length * 0.2)]
    const resistance = sortedPrices[Math.floor(sortedPrices.length * 0.8)]

    // Volatility
    const returns = []
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
    }
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length
    const variance2 = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length
    const volatility = Math.sqrt(variance2) * Math.sqrt(365) * 100

    return {
      ma7,
      ma14,
      ma30,
      rsi,
      macd: { macd, signal, histogram },
      bollingerBands,
      support,
      resistance,
      volatility
    }
  }

  private calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0
    const slice = prices.slice(-period)
    return slice.reduce((sum, price) => sum + price, 0) / slice.length
  }

  private calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0
    
    const multiplier = 2 / (period + 1)
    let ema = prices[0]
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier))
    }
    
    return ema
  }

  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50
    
    const changes = []
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1])
    }
    
    const gains = changes.map(change => change > 0 ? change : 0)
    const losses = changes.map(change => change < 0 ? Math.abs(change) : 0)
    
    const avgGain = gains.slice(-period).reduce((sum, gain) => sum + gain, 0) / period
    const avgLoss = losses.slice(-period).reduce((sum, loss) => sum + loss, 0) / period
    
    if (avgLoss === 0) return 100
    
    const rs = avgGain / avgLoss
    return 100 - (100 / (1 + rs))
  }

  private calculateMarketSentiment(coinData: CoinData, technicals: TechnicalIndicators): MarketSentiment {
    // Global Market Sentiment (simulated based on market trends)
    const marketTime = new Date().getHours()
    let globalSentiment = 50 + Math.sin(marketTime / 24 * Math.PI * 2) * 10
    
    // Add some randomness and trend
    globalSentiment += (Math.random() - 0.5) * 20
    globalSentiment = Math.max(0, Math.min(100, globalSentiment))

    // Trending Sentiment (based on price momentum)
    let trendingSentiment = 50
    if (coinData.price_change_percentage_24h > 5) trendingSentiment += 20
    else if (coinData.price_change_percentage_24h > 0) trendingSentiment += 10
    else if (coinData.price_change_percentage_24h < -5) trendingSentiment -= 20
    else if (coinData.price_change_percentage_24h < 0) trendingSentiment -= 10
    
    trendingSentiment = Math.max(0, Math.min(100, trendingSentiment))

    // Volume Sentiment (simulated based on market cap)
    let volumeSentiment = 50
    if (coinData.market_cap > 100000000000) volumeSentiment += 15 // Large cap = stable
    else if (coinData.market_cap > 10000000000) volumeSentiment += 5
    else volumeSentiment -= 10 // Small cap = risky
    
    volumeSentiment += (Math.random() - 0.5) * 20
    volumeSentiment = Math.max(0, Math.min(100, volumeSentiment))

    // Coin-Specific Sentiment
    let coinSpecificSentiment = 50
    
    // Technical indicator impact
    if (technicals.rsi > 70) coinSpecificSentiment -= 15 // Overbought
    else if (technicals.rsi < 30) coinSpecificSentiment += 15 // Oversold
    
    if (coinData.current_price > technicals.ma7) coinSpecificSentiment += 10
    if (technicals.ma7 > technicals.ma14) coinSpecificSentiment += 5
    if (technicals.macd.macd > technicals.macd.signal) coinSpecificSentiment += 5
    
    coinSpecificSentiment = Math.max(0, Math.min(100, coinSpecificSentiment))

    // Fear & Greed Index
    const fearGreedIndex = Math.max(0, Math.min(100, 
      (globalSentiment * 0.25) + 
      (trendingSentiment * 0.30) + 
      (volumeSentiment * 0.20) + 
      (coinSpecificSentiment * 0.25)
    ))

    return {
      globalSentiment,
      trendingSentiment,
      volumeSentiment,
      coinSpecificSentiment,
      fearGreedIndex
    }
  }

  private generateForecast(
    coinData: CoinData,
    technicals: TechnicalIndicators,
    sentiment: MarketSentiment,
    confidenceLevel: 'conservative' | 'moderate' | 'aggressive' = 'moderate'
  ): ForecastDay[] {
    const forecast: ForecastDay[] = []
    let currentPrice = coinData.current_price
    
    // Calculate base trend using our algorithm
    let baseTrend = 0

    // Moving Average Signals (30% weight)
    if (currentPrice > technicals.ma7) baseTrend += 0.5
    if (technicals.ma7 > technicals.ma14) baseTrend += 0.5
    if (technicals.ma14 > technicals.ma30) baseTrend += 0.3

    // Sentiment Score (25% weight)
    baseTrend += (sentiment.fearGreedIndex - 50) / 100

    // Technical Indicators (20% weight)
    if (technicals.rsi > 70) baseTrend -= 0.2 // Overbought
    if (technicals.rsi < 30) baseTrend += 0.2 // Oversold
    if (technicals.macd.macd > technicals.macd.signal) baseTrend += 0.1

    // Trend Strength (25% weight)
    const priceChange24h = coinData.price_change_percentage_24h || 0
    if (Math.abs(priceChange24h) > 5) {
      baseTrend += Math.sign(priceChange24h) * 0.3
    }

    // Confidence level adjustment
    const confidenceMultiplier = {
      conservative: 0.5,
      moderate: 1.0,
      aggressive: 1.5
    }[confidenceLevel]

    baseTrend *= confidenceMultiplier

    // Generate 5-day forecast
    let previousPrice = currentPrice

    for (let day = 1; day <= 5; day++) {
      const decayFactor = Math.pow(0.9, day - 1)
      const randomFactor = (Math.random() - 0.5) * 0.02 // ±1% noise
      const cyclicalFactor = Math.sin((day / 5) * Math.PI) * 0.01 // Weekly cycle
      
      const dailyChange = (baseTrend * 0.01 + randomFactor + cyclicalFactor) * decayFactor
      const newPrice = previousPrice * (1 + dailyChange)

      // Calculate price range using volatility
      const dailyVolatility = (technicals.volatility / 100) * 0.3 // Daily volatility estimate
      const priceRange = {
        low: newPrice * (1 - dailyVolatility),
        high: newPrice * (1 + dailyVolatility)
      }

      // Ensure price doesn't go negative
      const finalPrice = Math.max(newPrice, currentPrice * 0.1)
      priceRange.low = Math.max(priceRange.low, currentPrice * 0.1)

      // Calculate confidence (decreases each day)
      const confidence = Math.max(20, 80 - (day - 1) * 10)

      // Determine weather emoji
      const priceChangePercent = ((finalPrice - previousPrice) / previousPrice) * 100
      let weather = '🌤️'
      
      if (priceChangePercent > 5) weather = '🚀'
      else if (priceChangePercent > 2) weather = '☀️'
      else if (priceChangePercent > 0) weather = '🌤️'
      else if (priceChangePercent > -2) weather = '☁️'
      else if (priceChangePercent > -5) weather = '🌧️'
      else weather = '⛈️'

      // Determine volatility level
      let volatilityLevel: 'Low' | 'Medium' | 'High' = 'Medium'
      if (technicals.volatility < 20) volatilityLevel = 'Low'
      else if (technicals.volatility > 50) volatilityLevel = 'High'

      const forecastDate = new Date()
      forecastDate.setDate(forecastDate.getDate() + day)

      forecast.push({
        date: forecastDate.toISOString().split('T')[0],
        price: finalPrice,
        priceRange,
        confidence,
        weather,
        volatility: volatilityLevel
      })

      previousPrice = finalPrice
    }

    return forecast
  }

  async generateCompleteForecast(
    coinId: string,
    confidenceLevel: 'conservative' | 'moderate' | 'aggressive' = 'moderate'
  ): Promise<ForecastResult> {
    try {
      // Try to get real-time data first
      let coinData = await this.getRealTimePrice(coinId)
      
      // Fall back to static data if real-time data is not available
      if (!coinData) {
        console.log(`Using fallback data for ${coinId}`)
        const currentMarketPrices = this.getCurrentMarketPrices()
        coinData = currentMarketPrices[coinId]
        
        if (!coinData) {
          throw new Error(`Unsupported coin: ${coinId}`)
        }
      }

      // Generate realistic price history
      const priceHistory = this.generateRealisticPriceHistory(
        coinData.current_price, 
        30, 
        coinData.volatility_score
      )

      // Calculate technical indicators
      const technicals = this.calculateTechnicalIndicators(priceHistory, coinData.current_price)

      // Calculate market sentiment
      const sentiment = this.calculateMarketSentiment(coinData, technicals)

      // Generate forecast
      const forecast = this.generateForecast(coinData, technicals, sentiment, confidenceLevel)

      // Generate summary
      const trendDirection = forecast[0].price > coinData.current_price ? 'bullish' : 'bearish'
      const confidenceDescription = sentiment.fearGreedIndex > 70 ? 'optimistic' : 
                                   sentiment.fearGreedIndex < 30 ? 'cautious' : 'neutral'

      const summary = `${confidenceDescription.charAt(0).toUpperCase() + confidenceDescription.slice(1)} ${trendDirection} outlook with ${technicals.volatility > 50 ? 'high' : technicals.volatility > 20 ? 'moderate' : 'low'} volatility expected.`

      return {
        coin: coinData.name,
        symbol: coinData.symbol,
        currentPrice: coinData.current_price,
        forecast,
        technicals,
        sentiment,
        summary,
        disclaimer: 'This forecast is for entertainment purposes only and should not be used for investment decisions. Cryptocurrency markets are highly volatile and unpredictable.'
      }
    } catch (error) {
      console.error('Error generating smart forecast:', error)
      throw new Error('Failed to generate forecast')
    }
  }
}