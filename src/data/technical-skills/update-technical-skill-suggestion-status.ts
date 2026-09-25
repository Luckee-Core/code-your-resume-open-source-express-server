import type { Pool } from 'pg';
import { updateRows } from '../../utils/postgres';

/**
 * Update technical skill suggestion workflow status.
 */
export const updateTechnicalSkillSuggestionStatus = async (
  pool: Pool,
  suggestionId: string,
  status: 'accepted' | 'rejected',
): Promise<void> => {
  try {
    await updateRows(pool, 'technical_skills_suggestions', { status }, { id: suggestionId });
  } catch (error) {
    console.error('❌ updateTechnicalSkillSuggestionStatus:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
