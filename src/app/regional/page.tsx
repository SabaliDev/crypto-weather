'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface RegionalData {
  regions: Array<{
    region: string
    name: string
    icon: string
    condition: string
    temperature: number
    humidity: number
    cryptoCorrelation: string
    weather: {
      location: string
      temperature: number
      humidity: number
      pressure: number
      windSpeed: number
      condition: string
      description: string
    }
    cryptoData: Array<{
      id: string
      name: string
      current_price: number
      price_change_percentage_24h: number
      market_cap: number
      volume_24h: number
    }>
    analysis: {
      weatherSentiment: string
      marketSentiment: string
      confidenceScore: number
      correlation: string
      prediction: string
      volumeIndicator: string
    }
  }>
  globalCondition: {
    overall: string
    confidence: number
    trend: string
    timestamp: string
  }
}

interface QueryResponse {
  query: string
  response: string
  timestamp: string
}

export default function Regional() {
  const [regionalData, setRegionalData] = useState<RegionalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [queryResponse, setQueryResponse] = useState<QueryResponse | null>(null)
  const [queryLoading, setQueryLoading] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(true)

  useEffect(() => {
    const fetchRegionalData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
        const response = await fetch(`${apiUrl}/api/regional?analysis=true`)
        const result = await response.json()
        if (result.success) {
          setRegionalData(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch regional data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRegionalData()
  }, [])

  const handleQuery = async () => {
    if (!query.trim()) return
    
    setQueryLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const response = await fetch(`${apiUrl}/api/regional`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          region: selectedRegion
        })
      })
      
      const result = await response.json()
      if (result.success) {
        setQueryResponse(result.data)
      }
    } catch (error) {
      console.error('Query failed:', error)
    } finally {
      setQueryLoading(false)
    }
  }

  const refreshData = async () => {
    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const response = await fetch(`${apiUrl}/api/regional?analysis=true`)
      const result = await response.json()
      if (result.success) {
        setRegionalData(result.data)
      }
    } catch (error) {
      console.error('Failed to refresh data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--crypto-green)]"></div>
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
          {/* Header with Controls */}
          <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="gradient-text text-4xl font-bold mb-4 animate-slide-in">🌍 Intelligent Regional Crypto Climate</h1>
                <p className="text-[var(--text-secondary)] text-lg animate-slide-in">
                  {regionalData?.globalCondition.overall || 'Loading real-time regional conditions...'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={refreshData}
                  className="px-4 py-2 bg-[var(--crypto-blue)] text-white rounded-lg hover:opacity-80 transition-opacity"
                  disabled={loading}
                >
                  🔄 Refresh
                </button>
                <button
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  className="px-4 py-2 bg-[var(--crypto-green)] text-white rounded-lg hover:opacity-80 transition-opacity"
                >
                  {showAnalysis ? '📊 Hide Analysis' : '📈 Show Analysis'}
                </button>
              </div>
            </div>
            
            {regionalData?.globalCondition && (
              <div className="mt-4 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--text-secondary)]">Global Confidence:</span>
                  <div className="w-32 bg-[var(--surface-color)] rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[var(--crypto-blue)] to-[var(--crypto-green)] h-2 rounded-full"
                      style={{ width: `${regionalData.globalCondition.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {regionalData.globalCondition.confidence}%
                  </span>
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Trend: <span className="text-[var(--text-primary)] font-semibold">{regionalData.globalCondition.trend}</span>
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Updated: <span className="text-[var(--text-primary)]">{new Date(regionalData.globalCondition.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Query Section */}
          <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift mb-8">
            <h2 className="gradient-text text-2xl font-bold mb-4">🤖 AI-Powered Market Intelligence</h2>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about weather-crypto correlations, prices, or regional trends..."
                className="flex-1 px-4 py-2 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
                onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
              />
              <select
                value={selectedRegion || ''}
                onChange={(e) => setSelectedRegion(e.target.value || null)}
                className="px-4 py-2 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
              >
                <option value="">All Regions</option>
                <option value="asia-pacific">Asia-Pacific</option>
                <option value="europe">Europe</option>
                <option value="americas">Americas</option>
                <option value="middle-east">Middle East</option>
              </select>
              <button
                onClick={handleQuery}
                disabled={queryLoading || !query.trim()}
                className="px-6 py-2 bg-gradient-to-r from-[var(--crypto-blue)] to-[var(--crypto-green)] text-white rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {queryLoading ? '🔄' : '🔍'} Query
              </button>
            </div>
            
            {queryResponse && (
              <div className="mt-4 p-4 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-xl">
                <h3 className="font-bold text-[var(--text-primary)] mb-2">💡 AI Analysis:</h3>
                <pre className="text-sm text-[var(--text-primary)] whitespace-pre-wrap font-mono">
                  {queryResponse.response}
                </pre>
                <div className="text-xs text-[var(--text-secondary)] mt-2">
                  Generated at {new Date(queryResponse.timestamp).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Regional Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regionalData?.regions.map((region, index) => (
              <div
                key={index}
                className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift cursor-pointer"
                onClick={() => setSelectedRegion(region.region)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl animate-bounce-gentle">{region.icon}</div>
                  <div className="flex-1">
                    <h3 className="gradient-text text-xl font-bold">{region.name}</h3>
                    <p className="text-[var(--text-secondary)] text-sm">{region.condition}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        region.analysis?.marketSentiment === 'Bullish' ? 'bg-green-500/20 text-green-300' :
                        region.analysis?.marketSentiment === 'Bearish' ? 'bg-red-500/20 text-red-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {region.analysis?.marketSentiment || 'Neutral'}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {region.analysis?.confidenceScore || 50}% confidence
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-[var(--text-secondary)]">🌡️ Weather</span>
                      <span className="font-semibold text-[var(--text-primary)]">{region.weather?.temperature || region.temperature}°C</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[var(--text-secondary)]">💧 Humidity</span>
                      <span className="font-semibold text-[var(--text-primary)]">{region.weather?.humidity || region.humidity}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[var(--text-secondary)]">🌪️ Wind</span>
                      <span className="font-semibold text-[var(--text-primary)]">{region.weather?.windSpeed || 0} km/h</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[var(--text-secondary)]">📊 Volume</span>
                      <span className="font-semibold text-[var(--text-primary)]">{region.analysis?.volumeIndicator || 'Moderate'}</span>
                    </div>
                  </div>
                  
                  {showAnalysis && region.analysis && (
                    <div className="mt-4 p-3 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-xl">
                      <p className="text-xs font-medium text-[var(--text-primary)] mb-2">
                        🔍 AI Correlation Analysis:
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mb-2">
                        {region.analysis.correlation}
                      </p>
                      <p className="text-xs text-[var(--crypto-green)] font-medium">
                        📈 {region.analysis.prediction}
                      </p>
                    </div>
                  )}
                  
                  {region.cryptoData && region.cryptoData.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-[var(--text-secondary)] mb-2">Top Cryptos:</p>
                      <div className="space-y-1">
                        {region.cryptoData.slice(0, 3).map((crypto, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-[var(--text-primary)] font-medium">{crypto.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[var(--text-primary)]">${crypto.current_price?.toLocaleString()}</span>
                              <span className={`${crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h?.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
            <h2 className="gradient-text text-2xl font-bold mb-6 animate-slide-in">🗺️ Global Market Map</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl mb-3 animate-float">🌅</div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">Asia-Pacific</h3>
                <p className="text-sm text-[var(--text-secondary)]">Early morning rally in progress</p>
                <div className="mt-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                  +2.3% Active
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-3 animate-pulse-custom">☀️</div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">Europe</h3>
                <p className="text-sm text-[var(--text-secondary)]">Sunny outlook with strong volume</p>
                <div className="mt-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                  +1.8% Bullish
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-3 animate-sparkle">🌙</div>
                <h3 className="font-bold text-[var(--text-primary)] mb-2">Americas</h3>
                <p className="text-sm text-[var(--text-secondary)]">Night consolidation phase</p>
                <div className="mt-2 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">
                  -0.5% Cooling
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}