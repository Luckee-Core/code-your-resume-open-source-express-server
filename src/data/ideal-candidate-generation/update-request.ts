import type { Pool } from 'pg';
import { updateRows } from '../../utils/postgres';

/**
 * Mark an ideal candidate generation request as completed.
 *
 * @param pool - Supabase service-role client
 * @param id - Request ID
 */
export const updateIdealCandidateRequestCompleted = async (
  pool: Pool,
  id: string,
): Promise<void> => {
  try {
    await updateRows(
      pool,
      'ideal_candidate_generation_requests',
      { status: 'completed', updated_at: new Date().toISOString() },
      { id },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ updateIdealCandidateRequestCompleted:', message);
    throw new Error(`Failed to update ideal candidate request record: ${message}`);
  }
};

/**
 * Mark an ideal candidate generation request as failed.
 *
 * @param pool - Supabase service-role client
 * @param id - Request ID
 */
export const updateIdealCandidateRequestFailed = async (
  pool: Pool,
  id: string,
): Promise<void> => {
  try {
    await updateRows(
      pool,
      'ideal_candidate_generation_requests',
      { status: 'failed', updated_at: new Date().toISOString() },
      { id },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ updateIdealCandidateRequestFailed:', message);
  }
};
