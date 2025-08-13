import { getMCPClient } from './mcp-client'

export interface CryptocurrencyData {
  id: string
  name: string
  symbol: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number | null
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi: any | null
  last_updated: string
}

export interface HistoricalPrice {
  timestamp: number
  price: number
  market_cap?: number
  volume?: number
}

export interface TechnicalIndicators {
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

export interface MarketSentiment {
  globalSentiment: number
  trendingSentiment: number
  volumeSentiment: number
  coinSpecificSentiment: number
  fearGreedIndex: number
}

export interface ForecastDay {
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

export interface ForecastResult {
  coin: string
  symbol: string
  currentPrice: number
  forecast: ForecastDay[]
  technicals: TechnicalIndicators
  sentiment: MarketSentiment
  summary: string
  disclaimer: string
}

export class CryptoForecastEngine {
  private mcpClient = getMCPClient()

  async collectMarketData(coinId: string): Promise<{
    currentData: CryptocurrencyData
    historicalDaily: HistoricalPrice[]
    historicalHourly: HistoricalPrice[]
    globalMarket: any
    trendingData: any
  }> {
    try {
      // Phase 1: Data Collection
      const [currentData, globalData, trendingData] = await Promise.all([
        this.mcpClient.getCryptocurrencyById(coinId, { 
          market_data: true, 
          tickers: true 
        }),
        this.mcpClient.callTool('get_global_market_data', {}),
        this.mcpClient.callTool('get_trending', {})
      ])

      // Get historical data for technical analysis
      const historicalPromises = []
      
      // Get 30 days of daily data
      for (let i = 1; i <= 30; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        historicalPromises.push(
          this.mcpClient.getCryptocurrencyHistory(coinId, dateStr)
        )
      }

      const historicalResults = await Promise.all(historicalPromises)
      
      const historicalDaily = historicalResults.map((result, index) => {
        const date = new Date()
        date.setDate(date.getDate() - (index + 1))
        return {
          timestamp: date.getTime(),
          price: (Array.isArray(result.content) && result.content[0]?.text) ? JSON.parse(result.content[0].text).market_data?.current_price?.usd : 0,
          market_cap: (Array.isArray(result.content) && result.content[0]?.text) ? JSON.parse(result.content[0].text).market_data?.market_cap?.usd : 0,
          volume: (Array.isArray(result.content) && result.content[0]?.text) ? JSON.parse(result.content[0].text).market_data?.total_volume?.usd : 0
        }
      }).filter(item => item.price > 0).reverse()

      // For hourly data, we'll simulate based on daily data with some interpolation
      const historicalHourly = this.generateHourlyData(historicalDaily.slice(-7))

      return {
        currentData: (Array.isArray(currentData.content) && currentData.content[0]?.text) ? JSON.parse(currentData.content[0].text) : null,
        historicalDaily,
        historicalHourly,
        globalMarket: (Array.isArray(globalData.content) && globalData.content[0]?.text) ? JSON.parse(globalData.content[0].text) : null,
        trendingData: (Array.isArray(trendingData.content) && trendingData.content[0]?.text) ? JSON.parse(trendingData.content[0].text) : null
      }
    } catch (error) {
      console.error('Error collecting market data:', error)
      throw new Error('Failed to collect market data')
    }
  }

  private generateHourlyData(dailyData: HistoricalPrice[]): HistoricalPrice[] {
    const hourlyData: HistoricalPrice[] = []
    
    for (let i = 0; i < dailyData.length - 1; i++) {
      const startPrice = dailyData[i].price
      const endPrice = dailyData[i + 1].price
      const startTime = dailyData[i].timestamp
      
      for (let hour = 0; hour < 24; hour++) {
        const hourTimestamp = startTime + (hour * 60 * 60 * 1000)
        const priceVariation = (Math.random() - 0.5) * 0.02 // ±1% random variation
        const interpolatedPrice = startPrice + ((endPrice - startPrice) * (hour / 24)) + (startPrice * priceVariation)
        
        hourlyData.push({
          timestamp: hourTimestamp,
          price: Math.max(0, interpolatedPrice)
        })
      }
    }
    
    return hourlyData
  }

  calculateTechnicalIndicators(prices: HistoricalPrice[]): TechnicalIndicators {
    const priceValues = prices.map(p => p.price).filter(p => p > 0)
    
    if (priceValues.length < 30) {
      throw new Error('Insufficient price data for technical analysis')
    }

    // Moving Averages
    const ma7 = this.calculateSMA(priceValues, 7)
    const ma14 = this.calculateSMA(priceValues, 14)
    const ma30 = this.calculateSMA(priceValues, 30)

    // RSI
    const rsi = this.calculateRSI(priceValues, 14)

    // MACD
    const macd = this.calculateMACD(priceValues)

    // Bollinger Bands
    const bollingerBands = this.calculateBollingerBands(priceValues, 20)

    // Support and Resistance
    const support = this.calculatePercentile(priceValues.slice(-20), 20)
    const resistance = this.calculatePercentile(priceValues.slice(-20), 80)

    // Volatility
    const volatility = this.calculateVolatility(priceValues)

    return {
      ma7,
      ma14,
      ma30,
      rsi,
      macd,
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

  private calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12)
    const ema26 = this.calculateEMA(prices, 26)
    const macd = ema12 - ema26
    
    // For signal line, we'd need MACD history, so we'll approximate
    const signal = macd * 0.9 // Simplified signal line
    const histogram = macd - signal
    
    return { macd, signal, histogram }
  }

  private calculateBollingerBands(prices: number[], period: number = 20): {
    upper: number
    middle: number
    lower: number
    position: 'above' | 'middle' | 'below'
  } {
    const sma = this.calculateSMA(prices, period)
    const slice = prices.slice(-period)
    
    const variance = slice.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period
    const stdDev = Math.sqrt(variance)
    
    const upper = sma + (2 * stdDev)
    const lower = sma - (2 * stdDev)
    const currentPrice = prices[prices.length - 1]
    
    let position: 'above' | 'middle' | 'below'
    if (currentPrice > upper) position = 'above'
    else if (currentPrice < lower) position = 'below'
    else position = 'middle'
    
    return {
      upper,
      middle: sma,
      lower,
      position
    }
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = [...values].sort((a, b) => a - b)
    const index = (percentile / 100) * (sorted.length - 1)
    
    if (Math.floor(index) === index) {
      return sorted[index]
    } else {
      const lower = sorted[Math.floor(index)]
      const upper = sorted[Math.ceil(index)]
      return lower + (upper - lower) * (index - Math.floor(index))
    }
  }

  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0
    
    const returns = []
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
    }
    
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length
    
    return Math.sqrt(variance) * Math.sqrt(365) * 100 // Annualized volatility percentage
  }

  calculateMarketSentiment(
    globalMarket: any,
    trendingData: any,
    currentData: CryptocurrencyData,
    technicals: TechnicalIndicators
  ): MarketSentiment {
    // Global Market Sentiment (25% weight)
    let globalSentiment = 50 // Neutral baseline
    
    if (globalMarket?.data) {
      const marketCapChange = globalMarket.data.market_cap_change_percentage_24h_usd || 0
      globalSentiment += Math.max(-25, Math.min(25, marketCapChange * 2))
      
      // Bitcoin dominance impact
      const btcDominance = globalMarket.data.market_cap_percentage?.btc || 50
      if (btcDominance > 45) globalSentiment -= 5 // High BTC dominance = risk aversion
      if (btcDominance < 40) globalSentiment += 5 // Low BTC dominance = alt season
    }

    // Trending Activity Sentiment (20% weight)
    let trendingSentiment = 50
    
    if (trendingData?.coins) {
      const trendingCoins = trendingData.coins.length
      trendingSentiment += Math.min(20, trendingCoins * 2)
      
      // Check if our coin is trending
      const isTrending = trendingData.coins.some((coin: any) => 
        coin.item?.id === currentData.id
      )
      if (isTrending) trendingSentiment += 10
    }

    // Volume Analysis Sentiment (25% weight)
    let volumeSentiment = 50
    
    if (currentData.total_volume && currentData.market_cap) {
      const volumeToMcapRatio = currentData.total_volume / currentData.market_cap
      if (volumeToMcapRatio > 0.1) volumeSentiment += 15 // High volume = active interest
      if (volumeToMcapRatio < 0.02) volumeSentiment -= 10 // Low volume = lack of interest
      
      // Volume change impact
      const volumeChange24h = currentData.price_change_percentage_24h || 0
      if (volumeChange24h > 0 && currentData.price_change_percentage_24h > 0) {
        volumeSentiment += 10 // Volume confirming price move
      }
    }

    // Coin-Specific Sentiment (30% weight)
    let coinSpecificSentiment = 50
    
    // Recent performance vs market
    const priceChange24h = currentData.price_change_percentage_24h || 0
    coinSpecificSentiment += Math.max(-20, Math.min(20, priceChange24h))
    
    // Technical indicator sentiment
    if (technicals.rsi > 70) coinSpecificSentiment -= 10 // Overbought
    if (technicals.rsi < 30) coinSpecificSentiment += 10 // Oversold
    if (technicals.macd.macd > technicals.macd.signal) coinSpecificSentiment += 5 // Bullish MACD
    
    // Moving average positioning
    if (currentData.current_price > technicals.ma7) coinSpecificSentiment += 5
    if (technicals.ma7 > technicals.ma14) coinSpecificSentiment += 5
    if (technicals.ma14 > technicals.ma30) coinSpecificSentiment += 5

    // Fear & Greed Index Estimation
    const fearGreedIndex = Math.max(0, Math.min(100, 
      (globalSentiment * 0.25) + 
      (trendingSentiment * 0.20) + 
      (volumeSentiment * 0.25) + 
      (coinSpecificSentiment * 0.30)
    ))

    return {
      globalSentiment: Math.max(0, Math.min(100, globalSentiment)),
      trendingSentiment: Math.max(0, Math.min(100, trendingSentiment)),
      volumeSentiment: Math.max(0, Math.min(100, volumeSentiment)),
      coinSpecificSentiment: Math.max(0, Math.min(100, coinSpecificSentiment)),
      fearGreedIndex
    }
  }

  generateForecast(
    currentData: CryptocurrencyData,
    technicals: TechnicalIndicators,
    sentiment: MarketSentiment,
    confidenceLevel: 'conservative' | 'moderate' | 'aggressive' = 'moderate'
  ): ForecastDay[] {
    const currentPrice = currentData.current_price
    const forecast: ForecastDay[] = []
    
    // Calculate base trend
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
    const priceChange24h = currentData.price_change_percentage_24h || 0
    if (Math.abs(priceChange24h) > 5) {
      baseTrend += Math.sign(priceChange24h) * 0.3 // Strong trend
    }

    // Confidence level adjustment
    const confidenceMultiplier = {
      conservative: 0.5,
      moderate: 1.0,
      aggressive: 1.5
    }[confidenceLevel]

    baseTrend *= confidenceMultiplier

    // Generate daily forecasts
    let previousPrice = currentPrice

    for (let day = 1; day <= 5; day++) {
      const decayFactor = Math.pow(0.9, day - 1) // Confidence decreases over time
      const randomFactor = (Math.random() - 0.5) * 0.02 // ±1% noise
      
      const dailyChange = (baseTrend * 0.01 + randomFactor) * decayFactor
      const newPrice = previousPrice * (1 + dailyChange)

      // Calculate daily range using volatility
      const dailyVolatility = (technicals.volatility / 100) * 0.5 // Convert to daily volatility
      const priceRange = {
        low: newPrice * (1 - dailyVolatility),
        high: newPrice * (1 + dailyVolatility)
      }

      // Ensure price doesn't go negative
      const finalPrice = Math.max(newPrice, 0.001)
      priceRange.low = Math.max(priceRange.low, 0.001)

      // Calculate confidence (decreases each day)
      const confidence = Math.max(20, 80 - (day - 1) * 10)

      // Determine weather emoji based on price change
      const priceChangePercent = ((finalPrice - previousPrice) / previousPrice) * 100
      let weather = '🌤️' // Default partly cloudy
      
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
      // Collect all market data
      const marketData = await this.collectMarketData(coinId)
      
      if (!marketData.currentData || !marketData.historicalDaily.length) {
        throw new Error('Insufficient market data')
      }

      // Calculate technical indicators
      const technicals = this.calculateTechnicalIndicators(marketData.historicalDaily)

      // Calculate market sentiment
      const sentiment = this.calculateMarketSentiment(
        marketData.globalMarket,
        marketData.trendingData,
        marketData.currentData,
        technicals
      )

      // Generate forecast
      const forecast = this.generateForecast(
        marketData.currentData,
        technicals,
        sentiment,
        confidenceLevel
      )

      // Generate summary
      const trendDirection = forecast[0].price > marketData.currentData.current_price ? 'bullish' : 'bearish'
      const confidenceDescription = sentiment.fearGreedIndex > 70 ? 'optimistic' : 
                                   sentiment.fearGreedIndex < 30 ? 'cautious' : 'neutral'

      const summary = `${confidenceDescription.charAt(0).toUpperCase() + confidenceDescription.slice(1)} ${trendDirection} outlook with ${technicals.volatility > 50 ? 'high' : technicals.volatility > 20 ? 'moderate' : 'low'} volatility expected.`

      return {
        coin: marketData.currentData.name,
        symbol: marketData.currentData.symbol.toUpperCase(),
        currentPrice: marketData.currentData.current_price,
        forecast,
        technicals,
        sentiment,
        summary,
        disclaimer: 'This forecast is for entertainment purposes only and should not be used for investment decisions. Cryptocurrency markets are highly volatile and unpredictable.'
      }
    } catch (error) {
      console.error('Error generating forecast:', error)
      throw new Error('Failed to generate forecast')
    }
  }
}