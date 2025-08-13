import { getDatabase } from './database';
import { getMCPClient } from './mcp-client';

export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  current_price?: number;
  market_cap?: number;
  market_cap_rank?: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  last_updated?: string;
}

export interface CryptoHistory {
  crypto_id: string;
  price: number;
  market_cap?: number;
  volume?: number;
  timestamp: string;
}

export class CryptoCacheService {
  private db = getDatabase();
  private mcpClient = getMCPClient();
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  public getMCPClient() {
    return this.mcpClient;
  }

  async getCachedCrypto(symbol: string): Promise<CryptoCurrency | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM crypto_prices WHERE symbol = ? AND 
         cached_at > datetime('now', '-15 minutes')`,
        [symbol.toLowerCase()],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row as CryptoCurrency || null);
        }
      );
    });
  }

  async cacheCrypto(crypto: CryptoCurrency): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO crypto_prices 
         (id, symbol, name, current_price, market_cap, market_cap_rank, 
          price_change_24h, price_change_percentage_24h, last_updated) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          crypto.id,
          crypto.symbol.toLowerCase(),
          crypto.name,
          crypto.current_price,
          crypto.market_cap,
          crypto.market_cap_rank,
          crypto.price_change_24h,
          crypto.price_change_percentage_24h,
          crypto.last_updated
        ],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  }

  async getCryptoFromAPI(symbol: string): Promise<CryptoCurrency | null> {
    try {
      // First try searching by ID directly
      let response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${symbol.toLowerCase()}&order=market_cap_desc&per_page=1&page=1&sparkline=false&price_change_percentage=24h`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return data[0];
        }
      }
      
      // If direct ID search fails, try searching with the search endpoint
      const searchResponse = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(symbol)}`
      );
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        if (searchData.coins && searchData.coins.length > 0) {
          // Get the first matching coin's ID and fetch its data
          const coinId = searchData.coins[0].id;
          const detailResponse = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=1&page=1&sparkline=false&price_change_percentage=24h`
          );
          
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            if (Array.isArray(detailData) && detailData.length > 0) {
              return detailData[0];
            }
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching from CoinGecko API:', error);
      return null;
    }
  }

  async getCrypto(symbol: string, forceRefresh = false): Promise<CryptoCurrency | null> {
    if (!forceRefresh) {
      const cached = await this.getCachedCrypto(symbol);
      if (cached) {
        return cached;
      }
    }

    const freshData = await this.getCryptoFromAPI(symbol);
    if (freshData) {
      await this.cacheCrypto(freshData);
    }

    return freshData;
  }

  async addCryptoHistory(history: CryptoHistory): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO crypto_history 
         (crypto_id, price, market_cap, volume, timestamp) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          history.crypto_id,
          history.price,
          history.market_cap,
          history.volume,
          history.timestamp
        ],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  }

  async getCryptoHistory(cryptoId: string, limit = 100): Promise<CryptoHistory[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM crypto_history 
         WHERE crypto_id = ? 
         ORDER BY timestamp DESC 
         LIMIT ?`,
        [cryptoId, limit],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows as CryptoHistory[]);
        }
      );
    });
  }

  async getPopularCryptos(): Promise<CryptoCurrency[]> {
    return new Promise((resolve, reject) => {
      // First try to get recent cached data (within 15 minutes)
      this.db.all(
        `SELECT * FROM crypto_prices 
         WHERE datetime(cached_at) > datetime('now', '-15 minutes')
         ORDER BY market_cap_rank ASC 
         LIMIT 10`,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          
          // If we have recent data, return it
          if (rows && rows.length >= 5) {
            resolve(rows as CryptoCurrency[]);
            return;
          }
          
          // Otherwise, get any cached data (even if older) to show something
          this.db.all(
            `SELECT * FROM crypto_prices 
             WHERE market_cap_rank IS NOT NULL
             ORDER BY market_cap_rank ASC 
             LIMIT 10`,
            [],
            (err2, allRows) => {
              if (err2) {
                reject(err2);
                return;
              }
              resolve(allRows as CryptoCurrency[]);
            }
          );
        }
      );
    });
  }
}