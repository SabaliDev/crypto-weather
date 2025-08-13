import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function About() {
  return (
    <div className="layout-container flex h-full grow flex-col">
      <Header />
      <main className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-8">
        <div className="layout-content-container flex flex-col w-full max-w-4xl">
          <div className="crypto-card rounded-2xl shadow-2xl p-8 hover-lift mb-8">
            <h1 className="gradient-text text-4xl font-bold mb-6 animate-slide-in">ℹ️ About Crypto Weather</h1>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed animate-slide-in">
              Welcome to the most entertaining way to track cryptocurrency market conditions! 
              Our weather-themed approach makes understanding crypto markets as easy as checking the forecast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
              <div className="text-3xl mb-4 animate-bounce-gentle">🎭</div>
              <h2 className="gradient-text text-xl font-bold mb-3">Entertainment First</h2>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                This website is designed purely for entertainment and educational purposes. 
                We use weather metaphors to make crypto market data more engaging and fun to understand.
              </p>
            </div>

            <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
              <div className="text-3xl mb-4 animate-sparkle">🔮</div>
              <h2 className="gradient-text text-xl font-bold mb-3">Creative Predictions</h2>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Our forecasts are imaginative interpretations of market trends, 
                not real financial analysis. Think of them as crypto-themed weather stories!
              </p>
            </div>

            <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
              <div className="text-3xl mb-4 animate-float">🌡️</div>
              <h2 className="gradient-text text-xl font-bold mb-3">Weather Metaphors</h2>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                We translate market conditions into weather patterns: 
                sunny for bullish trends, stormy for volatility, and cloudy for uncertainty.
              </p>
            </div>

            <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
              <div className="text-3xl mb-4 animate-pulse-custom">🎨</div>
              <h2 className="gradient-text text-xl font-bold mb-3">Visual Experience</h2>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Enjoy beautiful animations, gradients, and interactive elements 
                that make exploring crypto data a delightful visual journey.
              </p>
            </div>
          </div>

          <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift mb-8">
            <h2 className="gradient-text text-2xl font-bold mb-4 animate-slide-in">🛠️ Built With Next.js</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              This application is built with modern web technologies including:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl">
                <div className="text-2xl mb-2">⚛️</div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Next.js</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl">
                <div className="text-2xl mb-2">🎨</div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Tailwind CSS</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl">
                <div className="text-2xl mb-2">📱</div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Responsive</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl">
                <div className="text-2xl mb-2">🚀</div>
                <p className="text-sm font-medium text-[var(--text-primary)]">API Ready</p>
              </div>
            </div>
          </div>

          <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
            <h2 className="gradient-text text-2xl font-bold mb-4 animate-slide-in">📋 Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-xl animate-sparkle">✨</span>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Interactive UI</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Hover effects and smooth animations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl animate-bounce-gentle">🔄</span>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Real-time Updates</h3>
                  <p className="text-sm text-[var(--text-secondary)]">API integration ready for live data</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl animate-float">📊</span>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Weather Forecasts</h3>
                  <p className="text-sm text-[var(--text-secondary)]">7-day crypto weather outlook</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl animate-pulse-custom">🌍</span>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Regional Views</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Global crypto climate zones</p>
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