import type { Pool } from 'pg';
import { updateRows } from '../../utils/postgres';

/**
 * Mark a company interest generation request as completed.
 *
 * @param pool - Supabase service-role client
 * @param id - Request ID
 */
export const updateCompanyInterestRequestCompleted = async (
  pool: Pool,
  id: string,
): Promise<void> => {
  try {
    await updateRows(
      pool,
      'company_interest_generation_requests',
      { status: 'completed', updated_at: new Date().toISOString() },
      { id },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ updateCompanyInterestRequestCompleted:', message);
    throw new Error(`Failed to update company interest request record: ${message}`);
  }
};

/**
 * Mark a company interest generation request as failed.
 *
 * @param pool - Supabase service-role client
 * @param id - Request ID
 */
export const updateCompanyInterestRequestFailed = async (
  pool: Pool,
  id: string,
): Promise<void> => {
  try {
    await updateRows(
      pool,
      'company_interest_generation_requests',
      { status: 'failed', updated_at: new Date().toISOString() },
      { id },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ updateCompanyInterestRequestFailed:', message);
  }
};
