import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';

let db: Database | null = null;

export function getDatabase(): Database {
  if (!db) {
    db = new sqlite3.Database('./crypto_cache.db');
    
    db.serialize(() => {
      db!.run(`
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
          cached_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db!.run(`
        CREATE TABLE IF NOT EXISTS crypto_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          crypto_id TEXT NOT NULL,
          price REAL NOT NULL,
          market_cap REAL,
          volume REAL,
          timestamp TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db!.run(`
        CREATE INDEX IF NOT EXISTS idx_crypto_prices_symbol ON crypto_prices(symbol);
      `);

      db!.run(`
        CREATE INDEX IF NOT EXISTS idx_crypto_history_crypto_id ON crypto_history(crypto_id);
      `);
    });
  }
  
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}