import { NextRequest, NextResponse } from 'next/server'
import { SmartForecastEngine } from '../../../lib/smart-forecast-engine'
import { CryptoForecastEngine } from '../../../lib/forecast-engine'

// Fallback mock data for when MCP is unavailable
const mockForecastData = {
  weekly: {
    period: '7 days',
    trend: 'Bullish storm system approaching',
    days: [
      { day: 'Mon', weather: '🚀', btc: 43000, eth: 2700, volatility: 'Low' },
      { day: 'Tue', weather: '☁️', btc: 42500, eth: 2650, volatility: 'Medium' },
      { day: 'Wed', weather: '⛈️', btc: 41800, eth: 2580, volatility: 'High' },
      { day: 'Thu', weather: '🌩️', btc: 40500, eth: 2450, volatility: 'High' },
      { day: 'Fri', weather: '🌤️', btc: 42000, eth: 2600, volatility: 'Medium' },
      { day: 'Sat', weather: '☀️', btc: 44000, eth: 2750, volatility: 'Low' },
      { day: 'Sun', weather: '🌈', btc: 45500, eth: 2850, volatility: 'Low' }
    ]
  },
  alerts: [
    {
      type: 'Crystal Ball Active',
      message: 'Advanced forecasting algorithm enabled',
      severity: 'low',
      icon: '🔮'
    }
  ]
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const coin = searchParams.get('coin') || 'bitcoin'
  const confidence = searchParams.get('confidence') || 'moderate'
  const useMockData = searchParams.get('mock') === 'true'
  const useLiveData = searchParams.get('live') === 'true'

  try {
    if (useMockData) {
      // Return simple mock data
      await new Promise(resolve => setTimeout(resolve, 400))
      return NextResponse.json({
        success: true,
        data: {
          weekly: mockForecastData.weekly,
          alerts: mockForecastData.alerts
        }
      })
    }

    let forecast
    
    if (useLiveData) {
      // Try to use the MCP-based forecasting engine
      try {
        const forecastEngine = new CryptoForecastEngine()
        forecast = await forecastEngine.generateCompleteForecast(
          coin,
          confidence as 'conservative' | 'moderate' | 'aggressive'
        )
      } catch (mcpError) {
        console.log('MCP engine failed, falling back to smart engine:', mcpError instanceof Error ? mcpError.message : mcpError)
        // Fall back to smart engine
        const smartEngine = new SmartForecastEngine()
        forecast = await smartEngine.generateCompleteForecast(
          coin,
          confidence as 'conservative' | 'moderate' | 'aggressive'
        )
      }
    } else {
      // Use the smart forecasting engine (default)
      const smartEngine = new SmartForecastEngine()
      forecast = await smartEngine.generateCompleteForecast(
        coin,
        confidence as 'conservative' | 'moderate' | 'aggressive'
      )
    }

    // Convert forecast to the expected format
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const forecastDays = forecast.forecast.map((day, index) => {
      const date = new Date(day.date)
      const dayName = weekdays[date.getDay()]
      
      return {
        day: dayName,
        weather: day.weather,
        btc: Math.round(day.price), // Use actual price for the selected coin
        eth: Math.round(day.price), // Use actual price for the selected coin (keeping both for backward compatibility)
        volatility: day.volatility,
        confidence: day.confidence,
        priceRange: day.priceRange
      }
    })

    // Generate alerts based on forecast
    const alerts = []
    
    // Volatility alerts
    const highVolDays = forecastDays.filter(day => day.volatility === 'High')
    if (highVolDays.length > 0) {
      alerts.push({
        type: 'Storm Warning',
        message: `High volatility expected on ${highVolDays.map(d => d.day).join(', ')}`,
        severity: 'high',
        icon: '⚠️'
      })
    }

    // Trend alerts
    const lastPrice = forecastDays[forecastDays.length - 1].btc
    const currentPrice = forecastDays[0].btc
    const changePercent = ((lastPrice - currentPrice) / currentPrice) * 100

    if (changePercent > 10) {
      alerts.push({
        type: 'Bullish Forecast',
        message: `Strong upward trend predicted (+${changePercent.toFixed(1)}%)`,
        severity: 'low',
        icon: '🚀'
      })
    } else if (changePercent < -10) {
      alerts.push({
        type: 'Bearish Warning',
        message: `Downward pressure expected (${changePercent.toFixed(1)}%)`,
        severity: 'high',
        icon: '📉'
      })
    }

    // Sentiment alerts
    if (forecast.sentiment.fearGreedIndex > 75) {
      alerts.push({
        type: 'Greed Zone',
        message: 'Market sentiment extremely bullish - caution advised',
        severity: 'medium',
        icon: '🔥'
      })
    } else if (forecast.sentiment.fearGreedIndex < 25) {
      alerts.push({
        type: 'Fear Zone',
        message: 'Market sentiment very bearish - potential opportunity',
        severity: 'medium',
        icon: '❄️'
      })
    }

    // Add crystal ball alert
    alerts.unshift({
      type: 'Crystal Ball Analysis',
      message: `${forecast.summary} (Fear & Greed: ${Math.round(forecast.sentiment.fearGreedIndex)})`,
      severity: 'low',
      icon: '🔮'
    })

    return NextResponse.json({
      success: true,
      data: {
        weekly: {
          period: '5 days',
          trend: forecast.summary,
          days: forecastDays
        },
        alerts,
        technicals: forecast.technicals,
        sentiment: forecast.sentiment,
        coin: forecast.coin,
        symbol: forecast.symbol,
        currentPrice: forecast.currentPrice,
        disclaimer: forecast.disclaimer
      }
    })

  } catch (error) {
    console.error('Forecast error:', error)
    
    // Fallback to mock data on error
    await new Promise(resolve => setTimeout(resolve, 400))
    return NextResponse.json({
      success: true,
      data: {
        weekly: mockForecastData.weekly,
        alerts: [
          ...mockForecastData.alerts,
          {
            type: 'Forecast Unavailable',
            message: 'Using mock data - MCP service unavailable',
            severity: 'medium',
            icon: '⚠️'
          }
        ]
      },
      fallback: true
    })
  }
}