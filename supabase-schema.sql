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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_crypto_prices_symbol ON crypto_prices(symbol);
CREATE INDEX IF NOT EXISTS idx_crypto_history_crypto_id ON crypto_history(crypto_id);
CREATE INDEX IF NOT EXISTS idx_crypto_prices_cached_at ON crypto_prices(cached_at);
CREATE INDEX IF NOT EXISTS idx_crypto_history_timestamp ON crypto_history(timestamp);

-- Enable Row Level Security (optional - can be configured later)
-- ALTER TABLE crypto_prices ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE crypto_history ENABLE ROW LEVEL SECURITY;