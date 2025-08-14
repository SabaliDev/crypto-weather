export default function Footer() {
  return (
    <footer className="border-t border-[var(--surface-color)] bg-gradient-to-r from-slate-900 to-slate-800 px-4 md:px-10 lg:px-20 xl:px-40 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center text-[var(--text-secondary)] text-xs space-y-2">
          <p><strong>⚠️ ENTERTAINMENT ONLY:</strong> This website is for fun and educational purposes. Not financial advice.</p>
          <p><strong>💰 INVESTMENT WARNING:</strong> Cryptocurrency investments are extremely risky. You could lose all your money.</p>
          <p className="pt-2 border-t border-[var(--surface-color)] mt-2">
            © 2024 Crypto Weather - Entertainment purposes only | <span className="animate-sparkle">🌈</span> Always do your own research
          </p>
          <p className="text-xs opacity-75 mt-1">
            Price data by <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">CoinGecko</a>
          </p>
        </div>
      </div>
    </footer>
  )
}