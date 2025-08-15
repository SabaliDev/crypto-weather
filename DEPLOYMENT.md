# Deployment Guide

## Setup Instructions

### 1. Database Setup (Supabase)
1. Create a new project at https://supabase.com
2. Go to **SQL Editor** in your Supabase dashboard
3. Run the schema from `supabase-schema.sql`:

```sql
-- Create crypto_prices table
CREATE TABLE IF NOT EXISTS crypto_prices (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  current_price REAL,
  market_cap REAL,
  market_cap_rank INTEGER,
  price_change_24h REAL,
  price_change_percentage_24h REAL,
  last_updated TEXT,
  cached_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create crypto_history table
CREATE TABLE IF NOT EXISTS crypto_history (
  id SERIAL PRIMARY KEY,
  crypto_id TEXT NOT NULL,
  price REAL NOT NULL,
  market_cap REAL,
  volume REAL,
  timestamp TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_crypto_prices_symbol ON crypto_prices(symbol);
CREATE INDEX IF NOT EXISTS idx_crypto_history_crypto_id ON crypto_history(crypto_id);
CREATE INDEX IF NOT EXISTS idx_crypto_prices_cached_at ON crypto_prices(cached_at);
CREATE INDEX IF NOT EXISTS idx_crypto_history_timestamp ON crypto_history(timestamp);
```

### 2. Backend Deployment (Vercel)

**Option A: Deploy via Vercel Dashboard**
1. Create a new project on https://vercel.com
2. Import the `backend` folder as the root directory
3. Set these environment variables:
   - `SUPABASE_URL` = Your Supabase project URL
   - `SUPABASE_ANON_KEY` = Your Supabase anon key
4. Deploy

**Option B: Deploy via CLI**
```bash
cd backend
npm install -g vercel
vercel login
vercel

# Set environment variables
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

### 3. Frontend Deployment (Vercel)

**Update environment variables:**
```bash
# .env.local (for production)
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

**Deploy:**
```bash
# From project root
vercel

# Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://your-backend-url.vercel.app
```

## Local Development

### Start Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev  # or npm start
```

### Start Frontend
```bash
# From project root
npm install
npm run dev
```

## Environment Variables Summary

**Backend (`backend/.env`)**:
```env
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

**Frontend (`.env.local`)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001  # dev
# NEXT_PUBLIC_API_URL=https://your-backend.vercel.app  # prod
```

## Testing the Deployment

**Backend Health Check:**
```bash
curl https://your-backend-url.vercel.app/health
```

**API Test:**
```bash
curl "https://your-backend-url.vercel.app/api/crypto/single?coin=bitcoin"
```

## Troubleshooting

**CORS Issues:**
- Ensure your frontend domain is added to the backend CORS configuration
- Update `server.js` origin array if needed

**Database Connection:**
- Verify Supabase environment variables are correct
- Check that tables exist in your Supabase dashboard

**API Rate Limits:**
- CoinGecko has rate limits - the app includes caching to minimize requests
- Consider upgrading to CoinGecko Pro API if needed