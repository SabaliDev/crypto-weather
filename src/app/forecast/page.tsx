'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface ForecastData {
  weekly: {
    period: string
    trend: string
    days: Array<{
      day: string
      weather: string
      btc: number
      eth: number
      volatility: string
      confidence?: number
      priceRange?: {
        low: number
        high: number
      }
    }>
  }
  alerts: Array<{
    type: string
    message: string
    severity: string
    icon: string
  }>
  technicals?: {
    ma7: number
    ma14: number
    ma30: number
    rsi: number
    volatility: number
    fearGreedIndex?: number
  }
  sentiment?: {
    fearGreedIndex: number
    globalSentiment: number
    trendingSentiment: number
    volumeSentiment: number
    coinSpecificSentiment: number
  }
  coin?: string
  symbol?: string
  currentPrice?: number
  disclaimer?: string
}

export default function Forecast() {
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCoin, setSelectedCoin] = useState('bitcoin')
  const [confidenceLevel, setConfidenceLevel] = useState('moderate')
  const [useMockData, setUseMockData] = useState(false)

  const fetchForecast = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        coin: selectedCoin,
        confidence: confidenceLevel,
        mock: useMockData.toString()
      })
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const response = await fetch(`${apiUrl}/api/forecast?${params}`)
      const result = await response.json()
      if (result.success) {
        setForecastData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch forecast:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchForecast()
  }, [selectedCoin, confidenceLevel, useMockData])

  if (loading) {
    return (
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--crypto-blue)]"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="layout-container flex h-full grow flex-col">
      <Header />
      <main className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-8">
        <div className="layout-content-container flex flex-col w-full max-w-6xl">
          <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift mb-8">
            <h1 className="gradient-text text-4xl font-bold mb-4 animate-slide-in">🔮 Crystal Ball Forecast</h1>
            <p className="text-[var(--text-secondary)] text-lg animate-slide-in mb-6">
              {forecastData?.weekly.trend || 'Loading forecast...'}
            </p>
            
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Cryptocurrency</label>
                <select 
                  value={selectedCoin} 
                  onChange={(e) => setSelectedCoin(e.target.value)}
                  className="forecast-select w-full p-2 rounded-lg"
                >
                  <option value="bitcoin">Bitcoin (BTC)</option>
                  <option value="ethereum">Ethereum (ETH)</option>
                  <option value="binancecoin">Binance Coin (BNB)</option>
                  <option value="solana">Solana (SOL)</option>
                  <option value="cardano">Cardano (ADA)</option>
                  <option value="chainlink">Chainlink (LINK)</option>
                  <option value="avalanche">Avalanche (AVAX)</option>
                  <option value="polygon">Polygon (MATIC)</option>
                  <option value="polkadot">Polkadot (DOT)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Confidence Level</label>
                <select 
                  value={confidenceLevel} 
                  onChange={(e) => setConfidenceLevel(e.target.value)}
                  className="forecast-select w-full p-2 rounded-lg"
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Data Source</label>
                <select 
                  value={useMockData ? 'mock' : 'smart'} 
                  onChange={(e) => setUseMockData(e.target.value === 'mock')}
                  className="forecast-select w-full p-2 rounded-lg"
                >
                  <option value="smart">Smart Algorithm</option>
                  <option value="mock">Simple Mock Data</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button 
                  onClick={fetchForecast}
                  disabled={loading}
                  className="w-full p-2 rounded-lg bg-[var(--crypto-blue)] text-white font-medium hover:bg-[var(--crypto-purple)] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Update Forecast'}
                </button>
              </div>
            </div>

            {forecastData?.coin && (
              <div className="text-center p-4 bg-[var(--crypto-card-bg)] rounded-lg">
                <h3 className="font-bold text-lg text-[var(--text-primary)]">
                  {forecastData.coin} ({forecastData.symbol})
                </h3>
                {forecastData.currentPrice && (
                  <p className="text-2xl font-bold gradient-text">
                    ${forecastData.currentPrice.toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>

          {forecastData?.alerts && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {forecastData.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`crypto-card rounded-xl p-4 hover-lift ${
                    alert.severity === 'high' ? 'neon-purple' : 'neon-blue'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl animate-bounce-gentle">{alert.icon}</span>
                    <div>
                      <h3 className="font-bold text-[var(--text-primary)]">{alert.type}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
            <h2 className="gradient-text text-2xl font-bold mb-6 animate-slide-in">5-Day Crystal Ball Prediction</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {forecastData?.weekly.days.map((day, index) => (
                <div
                  key={index}
                  className="crypto-card rounded-xl p-4 hover-scale animate-slide-in text-center"
                >
                  <p className="font-medium text-[var(--text-secondary)] mb-2">{day.day}</p>
                  <div className="text-3xl mb-3 animate-bounce-gentle">{day.weather}</div>
                  <div className="space-y-2">
                    <p className="text-sm text-[var(--text-primary)] font-semibold">
                      {forecastData?.symbol || 'Price'}: ${day.btc.toLocaleString()}
                    </p>
                    {day.priceRange && (
                      <p className="text-xs text-[var(--text-secondary)]">
                        Range: ${Math.round(day.priceRange.low).toLocaleString()} - ${Math.round(day.priceRange.high).toLocaleString()}
                      </p>
                    )}
                    {day.confidence && (
                      <p className="text-xs text-[var(--text-secondary)]">
                        Confidence: {day.confidence}%
                      </p>
                    )}
                    <p className={`text-xs px-2 py-1 rounded-full ${
                      day.volatility === 'High' ? 'bg-red-500/20 text-red-300' :
                      day.volatility === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {day.volatility} Vol
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Analysis Section */}
          {forecastData?.technicals && (
            <div className="mt-8 crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
              <h2 className="gradient-text text-2xl font-bold mb-6 animate-slide-in">📊 Technical Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="font-bold text-[var(--text-primary)] mb-4">Moving Averages</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">MA7: ${forecastData.technicals.ma7.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">MA14: ${forecastData.technicals.ma14.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">MA30: ${forecastData.technicals.ma30.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-[var(--text-primary)] mb-4">Momentum</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">RSI: {forecastData.technicals.rsi.toFixed(1)}</p>
                    <p className={`text-sm px-2 py-1 rounded ${
                      forecastData.technicals.rsi > 70 ? 'bg-red-500/20 text-red-300' :
                      forecastData.technicals.rsi < 30 ? 'bg-green-500/20 text-green-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {forecastData.technicals.rsi > 70 ? 'Overbought' :
                       forecastData.technicals.rsi < 30 ? 'Oversold' : 'Neutral'}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-[var(--text-primary)] mb-4">Risk</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Volatility: {forecastData.technicals.volatility.toFixed(1)}%</p>
                    <p className={`text-sm px-2 py-1 rounded ${
                      forecastData.technicals.volatility > 50 ? 'bg-red-500/20 text-red-300' :
                      forecastData.technicals.volatility > 20 ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {forecastData.technicals.volatility > 50 ? 'High Risk' :
                       forecastData.technicals.volatility > 20 ? 'Medium Risk' : 'Low Risk'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sentiment Analysis Section */}
          {forecastData?.sentiment && (
            <div className="mt-8 crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
              <h2 className="gradient-text text-2xl font-bold mb-6 animate-slide-in">🧠 Market Sentiment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <h3 className="font-bold text-[var(--text-primary)] mb-4">Fear & Greed Index</h3>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 opacity-20"></div>
                    <div className="absolute inset-2 rounded-full bg-[var(--crypto-card-bg)] flex items-center justify-center">
                      <span className="text-2xl font-bold gradient-text">
                        {Math.round(forecastData.sentiment.fearGreedIndex)}
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm px-3 py-1 rounded-full ${
                    forecastData.sentiment.fearGreedIndex > 75 ? 'bg-green-500/20 text-green-300' :
                    forecastData.sentiment.fearGreedIndex > 55 ? 'bg-yellow-500/20 text-yellow-300' :
                    forecastData.sentiment.fearGreedIndex > 45 ? 'bg-blue-500/20 text-blue-300' :
                    forecastData.sentiment.fearGreedIndex > 25 ? 'bg-orange-500/20 text-orange-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {forecastData.sentiment.fearGreedIndex > 75 ? 'Extreme Greed' :
                     forecastData.sentiment.fearGreedIndex > 55 ? 'Greed' :
                     forecastData.sentiment.fearGreedIndex > 45 ? 'Neutral' :
                     forecastData.sentiment.fearGreedIndex > 25 ? 'Fear' : 'Extreme Fear'}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-4">Sentiment Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Global Market</span>
                      <span className="text-sm font-bold text-gray-500">{Math.round(forecastData.sentiment.globalSentiment)}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Volume Activity</span>
                      <span className="text-sm font-bold text-gray-500">{Math.round(forecastData.sentiment.volumeSentiment)}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Trending Interest</span>
                      <span className="text-sm font-bold text-gray-500">{Math.round(forecastData.sentiment.trendingSentiment)}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Coin Specific</span>
                      <span className="text-sm font-bold text-gray-500">{Math.round(forecastData.sentiment.coinSpecificSentiment)}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
            <h2 className="gradient-text text-2xl font-bold mb-4 animate-slide-in">🌡️ Market Temperature</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2 animate-pulse-custom">🔥</div>
                <h3 className="font-bold text-[var(--text-primary)]">Hot Zone</h3>
                <p className="text-sm text-[var(--text-secondary)]">High activity, strong momentum</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2 animate-float">🌡️</div>
                <h3 className="font-bold text-[var(--text-primary)]">Moderate</h3>
                <p className="text-sm text-[var(--text-secondary)]">Stable conditions, normal trading</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2 animate-sparkle">❄️</div>
                <h3 className="font-bold text-[var(--text-primary)]">Cool Zone</h3>
                <p className="text-sm text-[var(--text-secondary)]">Low volatility, accumulation phase</p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          {forecastData?.disclaimer && (
            <div className="mt-8 crypto-card rounded-2xl shadow-2xl p-6 hover-lift border border-yellow-500/30">
              <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                ⚠️ Important Disclaimer
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {forecastData.disclaimer}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}