import type { Pool } from 'pg';
import { updateRows } from '../../utils/postgres';

/**
 * Mark a skills component generation request as completed.
 *
 * @param pool - Supabase service-role client
 * @param id - Request ID
 */
export const updateSkillsComponentRequestCompleted = async (
  pool: Pool,
  id: string,
): Promise<void> => {
  try {
    await updateRows(
      pool,
      'skills_component_generation_requests',
      { status: 'completed', updated_at: new Date().toISOString() },
      { id },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ updateSkillsComponentRequestCompleted:', message);
    throw new Error(`Failed to update skills component request record: ${message}`);
  }
};

/**
 * Mark a skills component generation request as failed.
 *
 * @param pool - Supabase service-role client
 * @param id - Request ID
 */
export const updateSkillsComponentRequestFailed = async (
  pool: Pool,
  id: string,
): Promise<void> => {
  try {
    await updateRows(
      pool,
      'skills_component_generation_requests',
      { status: 'failed', updated_at: new Date().toISOString() },
      { id },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ updateSkillsComponentRequestFailed:', message);
  }
};
