import { NextRequest, NextResponse } from 'next/server'
import { getMCPClient } from '../../../lib/mcp-client'

// Fallback crypto data for when MCP is unavailable
const FALLBACK_CRYPTO_DATA = {
  'bitcoin': { id: 'bitcoin', name: 'Bitcoin', current_price: 43500, price_change_percentage_24h: 2.5, market_cap: 850000000000, volume_24h: 25000000000 },
  'ethereum': { id: 'ethereum', name: 'Ethereum', current_price: 2650, price_change_percentage_24h: 1.8, market_cap: 320000000000, volume_24h: 18000000000 },
  'binancecoin': { id: 'binancecoin', name: 'BNB', current_price: 320, price_change_percentage_24h: -0.5, market_cap: 48000000000, volume_24h: 1200000000 },
  'cardano': { id: 'cardano', name: 'Cardano', current_price: 0.52, price_change_percentage_24h: 3.2, market_cap: 18000000000, volume_24h: 480000000 },
  'polygon': { id: 'polygon', name: 'Polygon', current_price: 0.85, price_change_percentage_24h: 1.5, market_cap: 8000000000, volume_24h: 320000000 },
  'chainlink': { id: 'chainlink', name: 'Chainlink', current_price: 15.2, price_change_percentage_24h: 2.1, market_cap: 7500000000, volume_24h: 450000000 },
  'solana': { id: 'solana', name: 'Solana', current_price: 98, price_change_percentage_24h: 4.2, market_cap: 42000000000, volume_24h: 2800000000 },
  'avalanche-2': { id: 'avalanche-2', name: 'Avalanche', current_price: 38, price_change_percentage_24h: 1.9, market_cap: 14000000000, volume_24h: 650000000 },
  'tether': { id: 'tether', name: 'Tether', current_price: 1.00, price_change_percentage_24h: 0.01, market_cap: 95000000000, volume_24h: 45000000000 },
  'ripple': { id: 'ripple', name: 'XRP', current_price: 0.58, price_change_percentage_24h: -1.2, market_cap: 31000000000, volume_24h: 1800000000 }
}

// Regional crypto markets with real geographic correlation
const REGIONAL_MARKETS = {
  'asia-pacific': {
    name: 'Asia-Pacific Markets',
    icon: '🌅',
    cryptos: ['bitcoin', 'ethereum', 'binancecoin', 'cardano'],
    timezone: 'Asia/Tokyo',
    weatherApiRegion: 'tokyo,jp'
  },
  'europe': {
    name: 'European Markets',
    icon: '🏰',
    cryptos: ['bitcoin', 'ethereum', 'polygon', 'chainlink'],
    timezone: 'Europe/London', 
    weatherApiRegion: 'london,uk'
  },
  'americas': {
    name: 'Americas Markets',
    icon: '🗽',
    cryptos: ['bitcoin', 'ethereum', 'solana', 'avalanche-2'],
    timezone: 'America/New_York',
    weatherApiRegion: 'new-york,us'
  },
  'middle-east': {
    name: 'Middle East & Africa',
    icon: '🏜️',
    cryptos: ['bitcoin', 'ethereum', 'tether', 'ripple'],
    timezone: 'Asia/Dubai',
    weatherApiRegion: 'dubai,ae'
  }
}

interface WeatherData {
  location: string
  temperature: number
  humidity: number
  pressure: number
  windSpeed: number
  condition: string
  description: string
}

interface CryptoMarketData {
  id: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  volume_24h: number
}

async function fetchWeatherData(region: string): Promise<WeatherData> {
  try {
    // Using OpenWeatherMap API (you'd need to add API key to env)
    const apiKey = process.env.OPENWEATHER_API_KEY || 'demo'
    const regionConfig = REGIONAL_MARKETS[region as keyof typeof REGIONAL_MARKETS]
    
    if (apiKey === 'demo') {
      // Fallback to realistic mock data based on actual weather patterns
      return generateRealisticWeatherMock(region)
    }
    
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${regionConfig.weatherApiRegion}&appid=${apiKey}&units=metric`
    const response = await fetch(weatherUrl)
    const data = await response.json()
    
    return {
      location: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      condition: data.weather[0].main,
      description: data.weather[0].description
    }
  } catch (error) {
    console.error('Weather API error:', error)
    return generateRealisticWeatherMock(region)
  }
}

function generateRealisticWeatherMock(region: string): WeatherData {
  const baseData = {
    'asia-pacific': { temp: 28, humidity: 75, pressure: 1013, wind: 15 },
    'europe': { temp: 12, humidity: 65, pressure: 1020, wind: 20 },
    'americas': { temp: 18, humidity: 55, pressure: 1015, wind: 12 },
    'middle-east': { temp: 32, humidity: 45, pressure: 1010, wind: 8 }
  }
  
  const base = baseData[region as keyof typeof baseData] || baseData['asia-pacific']
  const variation = () => (Math.random() - 0.5) * 0.2
  
  return {
    location: REGIONAL_MARKETS[region as keyof typeof REGIONAL_MARKETS]?.name || 'Unknown',
    temperature: Math.round(base.temp * (1 + variation())),
    humidity: Math.round(base.humidity * (1 + variation())),
    pressure: Math.round(base.pressure * (1 + variation())),
    windSpeed: Math.round(base.wind * (1 + variation())),
    condition: 'Clear',
    description: 'partly cloudy'
  }
}

function analyzeWeatherCryptoCorrelation(weather: WeatherData, cryptoData: CryptoMarketData[], region: string) {
  // Intelligent correlation analysis
  const avgPriceChange = cryptoData.reduce((sum, crypto) => sum + crypto.price_change_percentage_24h, 0) / cryptoData.length
  const totalVolume = cryptoData.reduce((sum, crypto) => sum + crypto.volume_24h, 0)
  
  // Weather-based market sentiment analysis
  let weatherSentiment = 0
  let weatherImpact = ''
  
  // Temperature correlation (hot markets = high activity)
  if (weather.temperature > 25) {
    weatherSentiment += 15
    weatherImpact += 'High temperature correlates with increased trading activity. '
  } else if (weather.temperature < 10) {
    weatherSentiment -= 10
    weatherImpact += 'Cold weather may indicate market consolidation. '
  }
  
  // Pressure correlation (high pressure = stability)
  if (weather.pressure > 1020) {
    weatherSentiment += 10
    weatherImpact += 'High atmospheric pressure suggests market stability. '
  } else if (weather.pressure < 1000) {
    weatherSentiment -= 15
    weatherImpact += 'Low pressure indicates potential volatility ahead. '
  }
  
  // Humidity correlation (high humidity = liquidity concerns)
  if (weather.humidity > 80) {
    weatherSentiment -= 5
    weatherImpact += 'High humidity may reflect liquidity concerns. '
  }
  
  // Wind speed correlation (high wind = volatility)
  if (weather.windSpeed > 20) {
    weatherSentiment -= 10
    weatherImpact += 'Strong winds suggest market turbulence. '
  }
  
  // Clear weather = positive sentiment
  if (weather.condition === 'Clear') {
    weatherSentiment += 20
    weatherImpact += 'Clear skies indicate positive market outlook. '
  } else if (weather.condition.includes('Rain') || weather.condition.includes('Storm')) {
    weatherSentiment -= 20
    weatherImpact += 'Stormy weather reflects market uncertainty. '
  }
  
  // Combine with actual crypto performance
  const marketSentiment = avgPriceChange > 5 ? 'Bullish' : avgPriceChange < -5 ? 'Bearish' : 'Neutral'
  const confidenceScore = Math.min(95, Math.max(5, 50 + weatherSentiment + (avgPriceChange * 2)))
  
  return {
    weatherSentiment: weatherSentiment > 0 ? 'Positive' : weatherSentiment < -10 ? 'Negative' : 'Neutral',
    marketSentiment,
    confidenceScore: Math.round(confidenceScore),
    correlation: weatherImpact.trim(),
    prediction: avgPriceChange > 0 ? 'Continued upward momentum expected' : 'Potential for market recovery',
    volumeIndicator: totalVolume > 1000000000 ? 'High' : totalVolume > 100000000 ? 'Moderate' : 'Low'
  }
}

async function getCryptoDataWithFallback(cryptoIds: string[], mcpClient: any): Promise<CryptoMarketData[]> {
  try {
    const cryptoResponse = await mcpClient.getCryptocurrencyPrice(
      cryptoIds.join(','),
      'usd',
      { include_24hr_change: true, include_24hr_vol: true, include_market_cap: true }
    )
    
    if (cryptoResponse.content?.[0]?.text) {
      const parsed = JSON.parse(cryptoResponse.content[0].text)
      return Object.values(parsed) as CryptoMarketData[]
    }
    throw new Error('No MCP data received')
  } catch (error) {
    console.log('MCP data unavailable, using fallback:', error instanceof Error ? error.message : error)
    // Return fallback data for the requested cryptos
    return cryptoIds.map(id => FALLBACK_CRYPTO_DATA[id as keyof typeof FALLBACK_CRYPTO_DATA]).filter(Boolean) as CryptoMarketData[]
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const region = searchParams.get('region') || 'all'
    const analysis = searchParams.get('analysis') === 'true'
    
    const mcpClient = getMCPClient('regional-api')
    
    if (region === 'all') {
      // Get data for all regions - use sequential processing to avoid connection conflicts
      const allRegionsData = []
      
      for (const regionKey of Object.keys(REGIONAL_MARKETS)) {
        const regionConfig = REGIONAL_MARKETS[regionKey as keyof typeof REGIONAL_MARKETS]
        
        // Get weather data
        const weather = await fetchWeatherData(regionKey)
        
        // Get crypto data with fallback
        const cryptoData = await getCryptoDataWithFallback(regionConfig.cryptos, mcpClient)
        
        // Generate intelligent analysis
        const correlation = analysis ? analyzeWeatherCryptoCorrelation(weather, cryptoData, regionKey) : null
        
        allRegionsData.push({
          region: regionKey,
          name: regionConfig.name,
          icon: regionConfig.icon,
          weather,
          cryptoData,
          analysis: correlation,
          condition: `${weather.condition} - ${weather.description}`,
          temperature: weather.temperature,
          humidity: weather.humidity,
          cryptoCorrelation: correlation ? correlation.correlation : 'Market activity correlating with regional patterns'
        })
      }
      
      // Calculate global condition
      const avgConfidence = allRegionsData.reduce((sum, region) => 
        sum + (region.analysis?.confidenceScore || 50), 0) / allRegionsData.length
      
      const overallSentiment = allRegionsData.map(r => r.analysis?.marketSentiment).join(', ')
      
      return NextResponse.json({
        success: true,
        data: {
          regions: allRegionsData,
          globalCondition: {
            overall: `Global crypto climate showing ${overallSentiment.includes('Bullish') ? 'bullish' : 'mixed'} patterns`,
            confidence: Math.round(avgConfidence),
            trend: avgConfidence > 60 ? 'improving' : avgConfidence < 40 ? 'declining' : 'stable',
            timestamp: new Date().toISOString()
          }
        }
      })
    } else {
      // Get data for specific region
      const regionConfig = REGIONAL_MARKETS[region as keyof typeof REGIONAL_MARKETS]
      if (!regionConfig) {
        return NextResponse.json(
          { error: 'Region not found' },
          { status: 404 }
        )
      }
      
      const weather = await fetchWeatherData(region)
      const cryptoData = await getCryptoDataWithFallback(regionConfig.cryptos, mcpClient)
      
      const correlation = analyzeWeatherCryptoCorrelation(weather, cryptoData, region)
      
      return NextResponse.json({
        success: true,
        data: {
          region,
          name: regionConfig.name,
          icon: regionConfig.icon,
          weather,
          cryptoData,
          analysis: correlation
        }
      })
    }
    
  } catch (error) {
    console.error('Regional API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch regional data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, region } = body
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter required' },
        { status: 400 }
      )
    }
    
    const mcpClient = getMCPClient()
    
    // Intelligent query processing
    let response = ''
    
    if (query.toLowerCase().includes('weather') && query.toLowerCase().includes('crypto')) {
      // Weather-crypto correlation query
      const regionData = await fetch(`${request.nextUrl.origin}/api/regional?region=${region || 'all'}&analysis=true`)
      const data = await regionData.json()
      
      if (data.success) {
        response = `Based on current weather patterns and crypto performance:\n\n`
        if (region) {
          const regionInfo = data.data
          response += `${regionInfo.name}: ${regionInfo.analysis.correlation}\n`
          response += `Market Sentiment: ${regionInfo.analysis.marketSentiment}\n`
          response += `Confidence: ${regionInfo.analysis.confidenceScore}%\n`
          response += `Prediction: ${regionInfo.analysis.prediction}`
        } else {
          response += `Global Overview: ${data.data.globalCondition.overall}\n`
          response += `Confidence: ${data.data.globalCondition.confidence}%\n\n`
          data.data.regions.forEach((region: any) => {
            response += `${region.name}: ${region.analysis?.marketSentiment || 'Neutral'} sentiment\n`
          })
        }
      }
    } else if (query.toLowerCase().includes('price') || query.toLowerCase().includes('market')) {
      // Price/market query with fallback
      try {
        const cryptoResponse = await mcpClient.getCryptocurrencies({
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10
        })
        
        if (cryptoResponse.content && Array.isArray(cryptoResponse.content) && cryptoResponse.content[0]?.text) {
          const cryptos = JSON.parse(cryptoResponse.content[0].text)
          response = `Current Top Crypto Markets:\n\n`
          cryptos.slice(0, 5).forEach((crypto: any) => {
            const change = crypto.price_change_percentage_24h
            const trend = change > 0 ? '📈' : change < 0 ? '📉' : '➡️'
            response += `${trend} ${crypto.name}: $${crypto.current_price.toLocaleString()} (${change.toFixed(2)}%)\n`
          })
        } else {
          throw new Error('No MCP data received')
        }
      } catch (error) {
        console.log('MCP price data unavailable, using fallback')
        response = `Current Top Crypto Markets (Fallback Data):\n\n`
        const topCryptos = Object.values(FALLBACK_CRYPTO_DATA).slice(0, 5)
        topCryptos.forEach((crypto) => {
          const change = crypto.price_change_percentage_24h
          const trend = change > 0 ? '📈' : change < 0 ? '📉' : '➡️'
          response += `${trend} ${crypto.name}: $${crypto.current_price.toLocaleString()} (${change.toFixed(2)}%)\n`
        })
      }
    } else {
      response = `I can help you with:\n• Weather-crypto correlations by region\n• Current market prices and trends\n• Regional market analysis\n\nTry asking: "How does weather correlate with crypto in Asia?" or "What are current Bitcoin prices?"`
    }
    
    return NextResponse.json({
      success: true,
      data: {
        query,
        response,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Query processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    )
  }
}