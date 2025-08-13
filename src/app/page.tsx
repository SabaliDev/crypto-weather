'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  weather: string;
  forecast: Array<{
    day: string;
    price: number;
    weather: string;
  }>;
  last_updated: string;
}

interface PopularCrypto {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  market_cap: number;
  market_cap_rank: number;
}

export default function Home() {
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null)
  const [popularCryptos, setPopularCryptos] = useState<PopularCrypto[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCoin, setSelectedCoin] = useState('bitcoin')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchError, setSearchError] = useState('')

  const fetchCryptoData = async (coin: string, refresh = false) => {
    try {
      const response = await fetch(`/api/crypto?coin=${coin}${refresh ? '&refresh=true' : ''}`)
      const result = await response.json()
      if (result.success) {
        setCryptoData(result.data)
      }
    } catch (error) {
      console.error('Error fetching crypto data:', error)
    }
  }

  const fetchPopularCryptos = async () => {
    try {
      const response = await fetch('/api/crypto/popular')
      const result = await response.json()
      if (result.success) {
        setPopularCryptos(result.data)
      }
    } catch (error) {
      console.error('Error fetching popular cryptos:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchCryptoData(selectedCoin),
        fetchPopularCryptos()
      ])
      setLoading(false)
    }
    loadData()
  }, [selectedCoin])

  const handleRefresh = () => {
    fetchCryptoData(selectedCoin, true)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    setSearchError('')
    setLoading(true)
    
    try {
      const response = await fetch(`/api/crypto?coin=${searchQuery.toLowerCase().trim()}`)
      const result = await response.json()
      
      if (result.success) {
        setSelectedCoin(searchQuery.toLowerCase().trim())
        setCryptoData(result.data)
        setSearchQuery('')
      } else {
        setSearchError(`Could not find cryptocurrency: ${searchQuery}. Try using the full name or symbol.`)
      }
    } catch (error) {
      setSearchError('Error searching for cryptocurrency. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`
    return `$${marketCap?.toFixed(0) || '0'}`
  }

  if (loading) {
    return (
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-8">
          <div className="layout-content-container flex flex-col w-full max-w-5xl">
            <div className="flex items-center justify-center h-64">
              <div className="text-[var(--text-primary)] text-xl">Loading crypto weather data...</div>
            </div>
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
        <div className="layout-content-container flex flex-col w-full max-w-5xl">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 p-6 crypto-card rounded-2xl shadow-2xl hover-lift animate-glow">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <h1 className="text-[var(--text-primary)] text-4xl font-bold animate-slide-in">
                  {cryptoData?.weather} {cryptoData?.name || 'Bitcoin'} Weather Storm
                </h1>
                <div className="flex items-center gap-2">
                  <select 
                    value={selectedCoin}
                    onChange={(e) => setSelectedCoin(e.target.value)}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[var(--text-primary)] border border-white/20 focus:border-blue-400 transition-all duration-300 hover-scale backdrop-blur-sm"
                  >
                    {popularCryptos.length > 0 ? (
                      popularCryptos.map((crypto) => (
                        <option key={crypto.id} value={crypto.id}>
                          {crypto.name} ({crypto.symbol.toUpperCase()})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="bitcoin">Bitcoin (BTC)</option>
                        <option value="ethereum">Ethereum (ETH)</option>
                        <option value="binancecoin">Binance Coin (BNB)</option>
                        <option value="cardano">Cardano (ADA)</option>
                        <option value="solana">Solana (SOL)</option>
                      </>
                    )}
                  </select>
                  <button 
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg text-[var(--text-primary)] transition-all duration-300 hover-scale"
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>
              <p className="text-[var(--text-secondary)] text-lg mt-2">
                Currently: <span className="font-semibold text-[var(--sunny-bg)] animate-sparkle">
                  {cryptoData?.weather} {(cryptoData?.change24h || 0) > 0 ? 'Bullish winds' : 'Bearish storms'} with {(cryptoData?.change24h || 0) > 5 ? 'moon' : 'volatility'} potential!
                </span>
              </p>
              
              {/* Custom Search Box */}
              <div className="mt-6 mb-4">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search any cryptocurrency (e.g., 'dogecoin', 'ADA', 'polkadot')..."
                      className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-[var(--text-primary)] border border-white/20 focus:border-blue-400 focus:outline-none transition-all duration-300 hover-scale backdrop-blur-sm placeholder:text-white/50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!searchQuery.trim() || loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/40 hover:to-purple-500/40 rounded-lg text-[var(--text-primary)] border border-blue-400/30 transition-all duration-300 hover-scale disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    🔍 Search Weather
                  </button>
                </form>
                {searchError && (
                  <div className="mt-3 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-300 text-sm animate-slide-in">
                    {searchError}
                  </div>
                )}
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                <div className="flex flex-col gap-1 rounded-xl p-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 hover-scale animate-pulse-custom">
                  <p className="text-sm font-medium text-[var(--text-secondary)]">🌪️ Volatility Winds</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {cryptoData?.change24h ? `${cryptoData.change24h.toFixed(1)}%` : '0%'}
                  </p>
                </div>
                <div className="flex flex-col gap-1 rounded-xl p-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 hover-scale animate-pulse-custom">
                  <p className="text-sm font-medium text-[var(--text-secondary)]">🌊 Market Ocean</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {cryptoData?.marketCap ? formatMarketCap(cryptoData.marketCap) : '$0'}
                  </p>
                </div>
                <div className="flex flex-col gap-1 rounded-xl p-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 hover-scale animate-pulse-custom">
                  <p className="text-sm font-medium text-[var(--text-secondary)]">💰 Current Price</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {cryptoData?.price ? formatPrice(cryptoData.price) : '$0'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-8xl animate-float hover-scale drop-shadow-lg">
                {cryptoData?.weather || '🚀'}
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
              <h2 className="gradient-text text-2xl font-bold mb-4 animate-slide-in">🔮 5-Day Crystal Ball</h2>
              <div className="space-y-4 relative z-10">
                {cryptoData?.forecast?.map((day, index) => (
                  <div key={index} className="flex items-center justify-between hover-scale animate-slide-in">
                    <p className="text-[var(--text-secondary)] font-medium">{day.day}</p>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 animate-sparkle text-2xl">{day.weather}</div>
                      <p className="text-[var(--text-primary)] font-semibold w-24 text-right">
                        {formatPrice(day.price)}
                      </p>
                    </div>
                  </div>
                )) || Array.from({length: 5}, (_, i) => (
                  <div key={i} className="flex items-center justify-between hover-scale animate-slide-in">
                    <p className="text-[var(--text-secondary)] font-medium">
                      {['Today', 'Tomorrow', 'In 2 Days', 'In 3 Days', 'In 4 Days'][i]}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 animate-sparkle text-2xl">🔄</div>
                      <p className="text-[var(--text-primary)] font-semibold w-24 text-right">Loading...</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
              <h2 className="gradient-text text-2xl font-bold mb-4 animate-slide-in">🏆 Popular Cryptos</h2>
              <div className="space-y-3 relative z-10">
                {popularCryptos.length > 0 ? popularCryptos.slice(0, 5).map((crypto) => (
                  <div 
                    key={crypto.id} 
                    className={`flex items-center justify-between gap-4 hover-scale animate-slide-in cursor-pointer p-2 rounded-lg transition-all ${
                      selectedCoin === crypto.id ? 'bg-blue-500/20 border border-blue-400/50' : 'hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedCoin(crypto.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 text-sm font-bold bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white">
                        #{crypto.market_cap_rank}
                      </div>
                      <div>
                        <p className="text-[var(--text-primary)] font-medium">{crypto.name}</p>
                        <p className="text-[var(--text-secondary)] text-sm uppercase">{crypto.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[var(--text-primary)] font-semibold">
                        {crypto.price ? formatPrice(crypto.price) : 'N/A'}
                      </p>
                      <p className={`text-sm ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {crypto.change24h ? `${crypto.change24h > 0 ? '+' : ''}${crypto.change24h.toFixed(1)}%` : 'N/A'}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-[var(--text-secondary)] text-center py-4">
                    Loading popular cryptos...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center items-center gap-4 py-6 border-t border-[var(--surface-color)]">
            <p className="text-[var(--text-secondary)] text-sm font-medium animate-bounce-gentle">📰 Spread the crypto vibes:</p>
            <div className="flex gap-2">
              <a className="flex items-center justify-center size-10 rounded-full crypto-card hover:neon-blue text-[var(--text-secondary)] hover:text-[var(--crypto-blue)] transition-all duration-300 hover-lift animate-pulse-custom" href="#">
                <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z"></path></svg>
              </a>
              <a className="flex items-center justify-center size-10 rounded-full crypto-card hover:neon-purple text-[var(--text-secondary)] hover:text-[var(--crypto-purple)] transition-all duration-300 hover-lift animate-pulse-custom" href="#">
                <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"></path></svg>
              </a>
              <a className="flex items-center justify-center size-10 rounded-full crypto-card hover:neon-green text-[var(--text-secondary)] hover:text-[var(--crypto-green)] transition-all duration-300 hover-lift animate-pulse-custom" href="#">
                <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M248,104a32,32,0,0,0-52.94-24.19c-16.75-8.9-36.76-14.28-57.66-15.53l5.19-31.17,17.72,2.72a24,24,0,1,0,2.87-15.74l-26-4a8,8,0,0,0-9.11,6.59L121.2,64.16c-21.84.94-42.82,6.38-60.26,15.65a32,32,0,0,0-42.59,47.74A59,59,0,0,0,16,144c0,21.93,12,42.35,33.91,57.49C70.88,216,98.61,224,128,224s57.12-8,78.09-22.51C228,186.35,240,165.93,240,144a59,59,0,0,0-2.35-16.45A32.16,32.16,0,0,0,248,104ZM184,24a8,8,0,1,1-8,8A8,8,0,0,1,184,24Zm40.13,93.78a8,8,0,0,0-3.29,10A43.58,43.58,0,0,1,224,144c0,16.53-9.59,32.27-27,44.33C178.67,201,154.17,208,128,208s-50.67-7-69-19.67C41.59,176.27,32,160.53,32,144a43.75,43.75,0,0,1,3.14-16.17,8,8,0,0,0-3.27-10A16,16,0,1,1,52.94,94.59a8,8,0,0,0,10.45,2.23l.36-.22C81.45,85.9,104.25,80,128,80h0c23.73,0,46.53,5.9,64.23,16.6l.42.25a8,8,0,0,0,10.39-2.26,16,16,0,1,1,21.07,23.19ZM88,144a16,16,0,1,1,16-16A16,16,0,0,1,88,144Zm96-16a16,16,0,1,1-16-16A16,16,0,0,1,184,128Zm-16.93,44.25a8,8,0,0,1-3.32,10.82,76.18,76.18,0,0,1-71.5,0,8,8,0,1,1,7.5-14.14,60.18,60.18,0,0,0,56.5,0A8,8,0,0,1,167.07,172.25Z"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}