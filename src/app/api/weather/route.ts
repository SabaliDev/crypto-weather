import { NextRequest, NextResponse } from 'next/server'

// Mock weather-crypto correlation data
const mockWeatherData = {
  regions: [
    {
      name: 'DeFi Rainbows',
      icon: '🌈',
      condition: 'Liquid gold everywhere!',
      temperature: 75,
      humidity: 60,
      cryptoCorrelation: 'High buying pressure'
    },
    {
      name: 'CEX Winds',
      icon: '🌪️',
      condition: 'Breezy with profit showers',
      temperature: 68,
      humidity: 45,
      cryptoCorrelation: 'Moderate volatility expected'
    },
    {
      name: 'Chain Lightning',
      icon: '⚡',
      condition: 'Electric storms ahead!',
      temperature: 82,
      humidity: 80,
      cryptoCorrelation: 'High transaction activity'
    },
    {
      name: 'Whale Watching Zone',
      icon: '🐋',
      condition: 'Deep currents flowing',
      temperature: 55,
      humidity: 95,
      cryptoCorrelation: 'Large movements detected'
    }
  ],
  globalCondition: {
    overall: 'Mostly bullish with scattered FUD showers',
    confidence: 75,
    trend: 'improving'
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const region = searchParams.get('region')

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))

  if (region) {
    const regionData = mockWeatherData.regions.find(
      r => r.name.toLowerCase().includes(region.toLowerCase())
    )
    
    if (!regionData) {
      return NextResponse.json(
        { error: 'Region not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: regionData
    })
  }

  return NextResponse.json({
    success: true,
    data: mockWeatherData
  })
}