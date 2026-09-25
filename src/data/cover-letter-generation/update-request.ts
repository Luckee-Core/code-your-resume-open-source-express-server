import type { Pool } from 'pg';
import { updateRows } from '../../utils/postgres';

/**
 * Mark a cover letter generation request as completed.
 *
 * @param pool - Supabase service-role client
 * @param id - Request ID
 */
export const updateCoverLetterRequestCompleted = async (
  pool: Pool,
  id: string,
): Promise<void> => {
  try {
    await updateRows(
      pool,
      'cover_letter_generation_requests',
      { status: 'completed', updated_at: new Date().toISOString() },
      { id },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ updateCoverLetterRequestCompleted:', message);
    throw new Error(`Failed to update cover letter request record: ${message}`);
  }
};

/**
 * Mark a cover letter generation request as failed.
 *
 * @param pool - Supabase service-role client
 * @param id - Request ID
 */
export const updateCoverLetterRequestFailed = async (
  pool: Pool,
  id: string,
): Promise<void> => {
  try {
    await updateRows(
      pool,
      'cover_letter_generation_requests',
      { status: 'failed', updated_at: new Date().toISOString() },
      { id },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ updateCoverLetterRequestFailed:', message);
  }
};
