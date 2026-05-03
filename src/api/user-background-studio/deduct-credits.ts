import { SupabaseClient } from '@supabase/supabase-js';

/**
 * No-op stub — CYR Express does not implement a credits system.
 * Signature matches mentorai-server's deductCredits for compatibility.
 */
export const deductCredits = async (
  _supabase: SupabaseClient,
  _userId: string,
  _creditsUsed: number,
  _exchangeId: string,
  _exchangeType: string,
): Promise<number> => {
  return 0;
};
