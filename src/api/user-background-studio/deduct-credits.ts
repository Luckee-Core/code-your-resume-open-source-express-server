import type { Pool } from 'pg';

/**
 * No-op stub — CYR Express does not implement a credits system.
 * Deduct credits for coach chat (stub for future billing integration).
 */
export const deductCredits = async (
  _pool: Pool,
  _userId: string,
  _creditsUsed: number,
  _exchangeId: string,
  _exchangeType: string,
): Promise<number> => {
  return 0;
};
