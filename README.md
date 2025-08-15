# 🌤️ Crypto Weather

A fun and engaging cryptocurrency tracking application that presents market conditions using weather metaphors. Track cryptocurrency prices, forecasts, and regional market sentiment with an intuitive weather-themed interface.

![Next.js](https://img.shields.io/badge/Next.js-14.0.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-2.55.0-green)
![Express](https://img.shields.io/badge/Express-4.18.2-yellow)

## ⚠️ Important Notice

**This application is for entertainment and educational purposes only.** It is not financial advice and should not be used for investment decisions. Cryptocurrency investments are extremely risky and you could lose all your money.

## ✨ Features

### 🏠 Home Dashboard
- Real-time cryptocurrency prices and market data
- Weather-themed price indicators (🚀 moon, ☀️ sunny, ⛈️ storms)
- 5-day price forecasts with weather metaphors
- Popular cryptocurrencies ranking
- Interactive search for any cryptocurrency
- Live market cap, volume, and 24h change data

### 🔮 Advanced Forecasting
- Crystal Ball predictions with technical analysis
- Multiple confidence levels (Conservative, Moderate, Aggressive)
- Smart algorithm vs. mock data options
- Technical indicators (RSI, MACD, Moving Averages, Bollinger Bands)
- Market sentiment analysis with Fear & Greed Index
- Volatility risk assessment
- Price range predictions with confidence scores

### 🌍 Regional Market Analysis
- Global cryptocurrency climate by region
- Real-time weather correlation analysis
- AI-powered market intelligence queries
- Regional sentiment tracking (Asia-Pacific, Europe, Americas, Middle East)
- Interactive region-specific insights
- Volume and activity indicators

### 🤖 AI Integration
- Model Context Protocol (MCP) integration for data fetching
- Smart forecast algorithms with historical data analysis
- Natural language query processing for market insights
- Automated correlation analysis between weather patterns and crypto movements

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/crypto-weather.git
   cd crypto-weather
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 with React 18 and TypeScript
- **Backend**: Node.js with Express.js
- **Styling**: Tailwind CSS with custom crypto-themed animations
- **Database**: Supabase (PostgreSQL) for caching cryptocurrency data
- **Data Source**: CoinGecko API direct integration
- **Deployment**: Vercel for both frontend and backend

### Project Structure
```
crypto-weath/
├── backend/                 # Node.js Express API server
│   ├── config/             # Supabase configuration
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic (crypto cache)
│   ├── server.js           # Express server entry point
│   └── package.json        # Backend dependencies
│
├── src/                    # Next.js frontend
│   ├── app/               # App Router pages
│   └── components/        # React components
│
└── supabase-schema.sql     # Database schema
```

## 📊 Data Sources

- **Cryptocurrency Data**: [CoinGecko API](https://www.coingecko.com/en/api/)
- **Weather Data**: Integrated weather APIs for regional correlation
- **Technical Analysis**: Custom-built indicators and algorithms
- **Market Sentiment**: Aggregated from multiple data sources

Price data provided by [CoinGecko](https://www.coingecko.com).

## 🎨 UI/UX Features

- **Weather Metaphors**: Cryptocurrency trends represented as weather conditions
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Smooth Animations**: CSS animations for enhanced user experience
- **Dark Theme**: Crypto-themed gradient backgrounds and neon accents
- **Interactive Elements**: Hover effects, loading states, and smooth transitions

## 🔧 Configuration

The application uses environment variables for configuration:

```env
# Add your environment variables here
DATABASE_URL=./crypto_cache.db
```

## 🛠️ Development

### Key Components

- **CryptoForecastEngine**: Advanced forecasting with technical analysis
- **SmartForecastEngine**: AI-enhanced prediction algorithms  
- **CryptoCache**: Efficient data caching and retrieval
- **MCP Client**: Integration with external data sources

### API Endpoints

- `GET /api/crypto` - Cryptocurrency data with weather metaphors
- `GET /api/crypto/popular` - Top cryptocurrencies by market cap
- `GET /api/forecast` - Advanced forecasting with technical analysis
- `GET /api/regional` - Regional market analysis
- `POST /api/regional` - AI-powered market queries

## 📱 Mobile Support

Fully responsive design optimized for:
- Mobile phones (portrait/landscape)
- Tablets and iPads
- Desktop computers
- Large displays

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CoinGecko](https://www.coingecko.com) for providing cryptocurrency data
- Weather data providers for regional correlation analysis
- The crypto community for inspiration and feedback

## ⚠️ Disclaimer

This application is for entertainment purposes only. The weather metaphors and forecasts are educational tools and should not be considered financial advice. Always do your own research before making investment decisions. Cryptocurrency investments carry significant risks and you may lose your entire investment.

---

Made with ❤️ and ☕ for the crypto community