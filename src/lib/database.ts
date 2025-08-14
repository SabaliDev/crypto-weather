import { supabase } from './supabase';

export { supabase as getDatabase };

export function closeDatabase(): void {
  // Supabase client doesn't need explicit closing
}