'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface RegionalData {
  regions: Array<{
    name: string
    icon: string
    condition: string
    temperature: number
    humidity: number
    cryptoCorrelation: string
  }>
  globalCondition: {
    overall: string
    confidence: number
    trend: string
  }
}

export default function Regional() {
  const [regionalData, setRegionalData] = useState<RegionalData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRegionalData = async () => {
      try {
        const response = await fetch('/api/weather')
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
          <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift mb-8">
            <h1 className="gradient-text text-4xl font-bold mb-4 animate-slide-in">🌍 Regional Crypto Climate</h1>
            <p className="text-[var(--text-secondary)] text-lg animate-slide-in">
              {regionalData?.globalCondition.overall || 'Loading regional conditions...'}
            </p>
            {regionalData?.globalCondition && (
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--text-secondary)]">Confidence:</span>
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
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regionalData?.regions.map((region, index) => (
              <div
                key={index}
                className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl animate-bounce-gentle">{region.icon}</div>
                  <div>
                    <h3 className="gradient-text text-xl font-bold">{region.name}</h3>
                    <p className="text-[var(--text-secondary)] text-sm">{region.condition}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">🌡️ Market Heat</span>
                    <span className="font-semibold text-[var(--text-primary)]">{region.temperature}°</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">💧 Liquidity</span>
                    <span className="font-semibold text-[var(--text-primary)]">{region.humidity}%</span>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-xl">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      📊 {region.cryptoCorrelation}
                    </p>
                  </div>
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