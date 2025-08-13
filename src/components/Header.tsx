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
        <svg className="text-[var(--primary-color)] animate-bounce-gentle" fill="none" height="28" viewBox="0 0 24 24" width="28" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"></path>
          <path d="M17.66 8.34C16.94 6.7 15.65 5.4 14.07 4.59L12.66 6.01C13.73 6.55 14.65 7.35 15.29 8.34H17.66Z" fill="currentColor" fillOpacity="0.6"></path>
          <path d="M6.34 15.66C7.06 17.3 8.35 18.6 9.93 19.41L11.34 17.99C10.27 17.45 9.35 16.65 8.71 15.66H6.34Z" fill="currentColor" fillOpacity="0.6"></path>
        </svg>
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
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 hover-scale animate-bounce-gentle neon-purple" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDu5rkM3KoWBgsKs4jSj8N1E1AueE9-svdokagJxdFm90o_AJNVCt7OFwB-pc1Y3zAPXNzRStxtaggaHxoZgjxnKAE24WhbylTKi0SxG9bBuWapg4k-RinWKhGSpwOgZzAjIai5XgADU47EjWz34ps24kBy1G93KwjO0l485DFDNd6m_W1072z3klR9vOx6y6fvY62Tf2Gyiq17Mir8hCTCk1TVKMnfmsOTosSsWGy6miNdPuzUoUsHSZg-YcT5sLwBmOQWXvC87QI")'}}></div>
      </div>
    </header>
  )
}