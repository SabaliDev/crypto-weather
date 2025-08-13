import { NextRequest, NextResponse } from 'next/server'
import { CryptoCacheService } from '../../../../lib/crypto-cache'

const cryptoCache = new CryptoCacheService()

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const cryptoId = searchParams.get('id')
  const limit = parseInt(searchParams.get('limit') || '100')

  if (!cryptoId) {
    return NextResponse.json(
      { error: 'Crypto ID is required' },
      { status: 400 }
    )
  }

  try {
    const history = await cryptoCache.getCryptoHistory(cryptoId, limit)
    
    return NextResponse.json({
      success: true,
      data: history
    })
  } catch (error) {
    console.error('Error fetching crypto history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch crypto history' },
      { status: 500 }
    )
  }
}