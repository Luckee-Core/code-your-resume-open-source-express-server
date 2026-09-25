import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

/**
 * Persist parsed AI payload (content, coachSections, suggestedSections, etc.).
 */
export const insertUserBackgroundStudioResponse = async (
  pool: Pool,
  id: string,
  structured: unknown,
): Promise<void> => {
  try {
    await insertRow(pool, 'user_background_studio_responses', {
      id,
      structured,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ insertUserBackgroundStudioResponse:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
