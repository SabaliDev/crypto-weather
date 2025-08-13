import { NextRequest, NextResponse } from 'next/server'
import { CryptoCacheService } from '../../../lib/crypto-cache'

export const dynamic = 'force-dynamic'

const cryptoCache = new CryptoCacheService()

function generateWeatherForecast(price: number, change24h: number) {
  const weather = change24h > 5 ? '🚀' : 
                 change24h > 2 ? '☀️' : 
                 change24h > 0 ? '🌤️' : 
                 change24h > -2 ? '☁️' : 
                 change24h > -5 ? '🌧️' : '⛈️'
  
  const forecast = []
  let basePrice = price
  
  for (let i = 0; i < 5; i++) {
    const dayNames = ['Today', 'Tomorrow', 'In 2 Days', 'In 3 Days', 'In 4 Days']
    const variation = (Math.random() - 0.5) * 0.1
    basePrice *= (1 + variation)
    
    const dayChange = variation * 100
    const dayWeather = dayChange > 5 ? '🚀' : 
                      dayChange > 2 ? '☀️' : 
                      dayChange > 0 ? '🌤️' : 
                      dayChange > -2 ? '☁️' : 
                      dayChange > -5 ? '🌧️' : '⛈️'
    
    forecast.push({
      day: dayNames[i],
      price: Math.round(basePrice * 100) / 100,
      weather: dayWeather
    })
  }
  
  return { weather, forecast }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const coin = searchParams.get('coin') || 'bitcoin'
  const forceRefresh = searchParams.get('refresh') === 'true'

  try {
    let cryptoData = await cryptoCache.getCrypto(coin, forceRefresh)
    
    if (!cryptoData) {
      // Provide fallback data for Bitcoin if MCP fails
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
        }
      } else {
        return NextResponse.json(
          { error: 'Cryptocurrency not found' },
          { status: 404 }
        )
      }
    }

    const { weather, forecast } = generateWeatherForecast(
      cryptoData.current_price || 0,
      cryptoData.price_change_percentage_24h || 0
    )

    return NextResponse.json({
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
    })
  } catch (error) {
    console.error('Error fetching crypto data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Mock endpoint for updating crypto alerts/preferences
    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      data: body
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}