import { supabase } from './supabase';
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
  private mcpClient = getMCPClient();
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  public getMCPClient() {
    return this.mcpClient;
  }

  async getCachedCrypto(symbol: string): Promise<CryptoCurrency | null> {
    try {
      const { data, error } = await supabase
        .from('crypto_prices')
        .select('*')
        .eq('symbol', symbol.toLowerCase())
        .gte('cached_at', new Date(Date.now() - this.CACHE_DURATION).toISOString())
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Error getting cached crypto:', error);
      return null;
    }
  }

  async cacheCrypto(crypto: CryptoCurrency): Promise<void> {
    try {
      const { error } = await supabase
        .from('crypto_prices')
        .upsert({
          id: crypto.id,
          symbol: crypto.symbol.toLowerCase(),
          name: crypto.name,
          current_price: crypto.current_price,
          market_cap: crypto.market_cap,
          market_cap_rank: crypto.market_cap_rank,
          price_change_24h: crypto.price_change_24h,
          price_change_percentage_24h: crypto.price_change_percentage_24h,
          last_updated: crypto.last_updated,
          cached_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error caching crypto:', error);
      throw error;
    }
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
    try {
      const { error } = await supabase
        .from('crypto_history')
        .insert({
          crypto_id: history.crypto_id,
          price: history.price,
          market_cap: history.market_cap,
          volume: history.volume,
          timestamp: history.timestamp
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error adding crypto history:', error);
      throw error;
    }
  }

  async getCryptoHistory(cryptoId: string, limit = 100): Promise<CryptoHistory[]> {
    try {
      const { data, error } = await supabase
        .from('crypto_history')
        .select('*')
        .eq('crypto_id', cryptoId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error getting crypto history:', error);
      return [];
    }
  }

  async getPopularCryptos(): Promise<CryptoCurrency[]> {
    try {
      // First try to get recent cached data (within 15 minutes)
      const { data: recentData, error: recentError } = await supabase
        .from('crypto_prices')
        .select('*')
        .gte('cached_at', new Date(Date.now() - this.CACHE_DURATION).toISOString())
        .order('market_cap_rank', { ascending: true })
        .limit(10);

      if (recentError) {
        throw recentError;
      }

      // If we have recent data, return it
      if (recentData && recentData.length >= 5) {
        return recentData;
      }

      // Otherwise, get any cached data (even if older) to show something
      const { data: allData, error: allError } = await supabase
        .from('crypto_prices')
        .select('*')
        .not('market_cap_rank', 'is', null)
        .order('market_cap_rank', { ascending: true })
        .limit(10);

      if (allError) {
        throw allError;
      }

      return allData || [];
    } catch (error) {
      console.error('Error getting popular cryptos:', error);
      return [];
    }
  }
}