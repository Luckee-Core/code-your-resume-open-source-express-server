import type { Pool } from 'pg';
import { updateRows } from '../../utils/postgres';

/**
 * Mark a team conversation generation request as completed.
 *
 * @param pool - Supabase service-role client
 * @param id - Request ID
 */
export const updateTeamConversationRequestCompleted = async (
  pool: Pool,
  id: string,
): Promise<void> => {
  try {
    await updateRows(
      pool,
      'team_conversation_generation_requests',
      { status: 'completed', updated_at: new Date().toISOString() },
      { id },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ updateTeamConversationRequestCompleted:', message);
    throw new Error(`Failed to update team conversation request record: ${message}`);
  }
};

/**
 * Mark a team conversation generation request as failed.
 *
 * @param pool - Supabase service-role client
 * @param id - Request ID
 */
export const updateTeamConversationRequestFailed = async (
  pool: Pool,
  id: string,
): Promise<void> => {
  try {
    await updateRows(
      pool,
      'team_conversation_generation_requests',
      { status: 'failed', updated_at: new Date().toISOString() },
      { id },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ updateTeamConversationRequestFailed:', message);
  }
};
