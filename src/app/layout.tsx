import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Crypto Weather',
  description: 'Track cryptocurrency market conditions with weather-themed forecasts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="relative flex size-full min-h-screen flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 group/design-root overflow-x-hidden">
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" async></script>
        {children}
      </body>
    </html>
  )
}