import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      crypto_prices: {
        Row: {
          id: string
          symbol: string
          name: string
          current_price: number | null
          market_cap: number | null
          market_cap_rank: number | null
          price_change_24h: number | null
          price_change_percentage_24h: number | null
          last_updated: string | null
          cached_at: string
        }
        Insert: {
          id: string
          symbol: string
          name: string
          current_price?: number | null
          market_cap?: number | null
          market_cap_rank?: number | null
          price_change_24h?: number | null
          price_change_percentage_24h?: number | null
          last_updated?: string | null
          cached_at?: string
        }
        Update: {
          id?: string
          symbol?: string
          name?: string
          current_price?: number | null
          market_cap?: number | null
          market_cap_rank?: number | null
          price_change_24h?: number | null
          price_change_percentage_24h?: number | null
          last_updated?: string | null
          cached_at?: string
        }
      }
      crypto_history: {
        Row: {
          id: number
          crypto_id: string
          price: number
          market_cap: number | null
          volume: number | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: number
          crypto_id: string
          price: number
          market_cap?: number | null
          volume?: number | null
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: number
          crypto_id?: string
          price?: number
          market_cap?: number | null
          volume?: number | null
          timestamp?: string
          created_at?: string
        }
      }
    }
  }
}