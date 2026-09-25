import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

/**
 * Persist parsed AI payload (content, coachSections, suggestedSkills, etc.).
 */
export const insertTechnicalSkillsResponse = async (
  pool: Pool,
  id: string,
  structured: unknown,
): Promise<void> => {
  try {
    await insertRow(pool, 'technical_skills_responses', {
      id,
      structured,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ insertTechnicalSkillsResponse:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
