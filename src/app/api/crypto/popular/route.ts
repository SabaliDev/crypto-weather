import { NextRequest, NextResponse } from 'next/server'
import { CryptoCacheService } from '../../../../lib/crypto-cache'

export const dynamic = 'force-dynamic'

const cryptoCache = new CryptoCacheService()

export async function GET() {
  try {
    let popularCryptos = await cryptoCache.getPopularCryptos()
    
    // If no cached data, fetch from API and cache
    if (popularCryptos.length === 0) {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h'
        )
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        if (Array.isArray(data)) {
          // Cache all the popular cryptos
          for (const crypto of data) {
            await cryptoCache.cacheCrypto(crypto)
          }
          popularCryptos = data
        }
      } catch (apiError) {
        console.error('Error fetching from CoinGecko API:', apiError)
        // Return default popular cryptos if MCP fails
        popularCryptos = [
          {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            current_price: 45000,
            price_change_percentage_24h: 2.5,
            market_cap: 850000000000,
            market_cap_rank: 1
          },
          {
            id: 'ethereum',
            symbol: 'eth',
            name: 'Ethereum',
            current_price: 2500,
            price_change_percentage_24h: 1.8,
            market_cap: 300000000000,
            market_cap_rank: 2
          }
        ]
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
    }))

    return NextResponse.json({
      success: true,
      data: formattedData
    })
  } catch (error) {
    console.error('Error fetching popular cryptos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular cryptocurrencies' },
      { status: 500 }
    )
  }
}