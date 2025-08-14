import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function About() {
  return (
    <div className="layout-container flex h-full grow flex-col">
      <Header />
      <main className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-8">
        <div className="layout-content-container flex flex-col w-full max-w-4xl">
          <div className="crypto-card rounded-2xl shadow-2xl p-8 hover-lift mb-8">
            <h1 className="gradient-text text-4xl font-bold mb-6 animate-slide-in">🌦️ About Crypto Weather</h1>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed animate-slide-in">
              Finally, someone who gets it! Why check boring charts when you can see if Bitcoin is having a sunny day or if Ethereum is caught in a thunderstorm? 
              We're bridging the gap between serious market analysis and the universal language of weather complaints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
              <div className="text-3xl mb-4 animate-bounce-gentle">🎪</div>
              <h2 className="gradient-text text-xl font-bold mb-3">Seriously Fun</h2>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                We're 100% committed to making crypto accessible through the universally understood art of weather-based small talk. 
                Because nothing says "professional trader" like asking if Dogecoin will need an umbrella today.
              </p>
            </div>

            <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
              <div className="text-3xl mb-4 animate-sparkle">🎯</div>
              <h2 className="gradient-text text-xl font-bold mb-3">Educated Guessing</h2>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Our forecasts blend real market data with meteorological wisdom. 
                Just like actual weather forecasts, we're right about 60% of the time, but with better graphics.
              </p>
            </div>

            <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
              <div className="text-3xl mb-4 animate-float">⛈️</div>
              <h2 className="gradient-text text-xl font-bold mb-3">Market Meteorology</h2>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Bulls bring sunshine, bears bring storms, and sideways trading brings that annoying persistent drizzle. 
                We're basically the Weather Channel, but for your portfolio's emotional state.
              </p>
            </div>

            <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
              <div className="text-3xl mb-4 animate-pulse-custom">✨</div>
              <h2 className="gradient-text text-xl font-bold mb-3">Eye Candy Engineering</h2>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                We put serious effort into making pretty things move smoothly. 
                Because if you're going to watch your portfolio crash, it might as well look fabulous doing it.
              </p>
            </div>
          </div>

          
          <div className="crypto-card rounded-2xl shadow-2xl p-6 hover-lift">
            <h2 className="gradient-text text-2xl font-bold mb-4 animate-slide-in">🎪 What We Actually Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-xl animate-sparkle">🎮</span>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Interactive Everything</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Buttons that actually feel nice to click</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl animate-bounce-gentle">📡</span>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Live Market Drama</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Real data, real time, real emotional damage</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl animate-float">🌦️</span>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">7-Day Crypto Climate</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Pack an umbrella or bring sunscreen</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl animate-pulse-custom">🗺️</span>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Global Market Weather</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Because crypto never sleeps, neither does weather</p>
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