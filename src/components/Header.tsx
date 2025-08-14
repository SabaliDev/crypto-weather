'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[var(--surface-color)] px-10 py-4">
      <div className="flex items-center gap-3 text-[var(--text-primary)]">
        
        <h2 className="text-[var(--text-primary)] text-xl font-bold animate-slide-in">🌊 Crypto Weather</h2>
      </div>
      <nav className="hidden md:flex items-center gap-8 relative z-10">
        <Link 
          className={`font-semibold transition-all duration-300 text-sm font-medium hover-scale ${
            isActive('/') ? 'text-[var(--crypto-blue)]' : 'text-[var(--text-secondary)] hover:text-[var(--crypto-blue)]'
          }`} 
          href="/"
        >
          🏠 Home
        </Link>
        <Link 
          className={`transition-all duration-300 text-sm font-medium hover-scale ${
            isActive('/forecast') ? 'text-[var(--crypto-purple)]' : 'text-[var(--text-secondary)] hover:text-[var(--crypto-purple)]'
          }`} 
          href="/forecast"
        >
          🔮 Forecast
        </Link>
        <Link 
          className={`transition-all duration-300 text-sm font-medium hover-scale ${
            isActive('/regional') ? 'text-[var(--crypto-green)]' : 'text-[var(--text-secondary)] hover:text-[var(--crypto-green)]'
          }`} 
          href="/regional"
        >
          🌍 Regional
        </Link>
        <Link 
          className={`transition-all duration-300 text-sm font-medium hover-scale ${
            isActive('/about') ? 'text-[var(--crypto-orange)]' : 'text-[var(--text-secondary)] hover:text-[var(--crypto-orange)]'
          }`} 
          href="/about"
        >
          ℹ️ About
        </Link>
      </nav>
      <div className="flex items-center gap-4 relative z-10">
        <button className="flex items-center justify-center rounded-xl h-10 w-10 crypto-card text-[var(--text-secondary)] hover:text-[var(--crypto-blue)] transition-all duration-300 hover-lift neon-blue">
          <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
            <path d="M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H165a88,88,0,0,0-85.23,66,8,8,0,0,1-15.5-4A103.94,103.94,0,0,1,165,96h39.71L170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66ZM192,208H40V88a8,8,0,0,0-16,0V208a16,16,0,0,0,16,16H192a8,8,0,0,0,0-16Z"></path>
          </svg>
        </button>
        {/* <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 hover-scale animate-bounce-gentle neon-purple" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDu5rkM3KoWBgsKs4jSj8N1E1AueE9-svdokagJxdFm90o_AJNVCt7OFwB-pc1Y3zAPXNzRStxtaggaHxoZgjxnKAE24WhbylTKi0SxG9bBuWapg4k-RinWKhGSpwOgZzAjIai5XgADU47EjWz34ps24kBy1G93KwjO0l485DFDNd6m_W1072z3klR9vOx6y6fvY62Tf2Gyiq17Mir8hCTCk1TVKMnfmsOTosSsWGy6miNdPuzUoUsHSZg-YcT5sLwBmOQWXvC87QI")'}}></div> */}
      </div>
    </header>
  )
}