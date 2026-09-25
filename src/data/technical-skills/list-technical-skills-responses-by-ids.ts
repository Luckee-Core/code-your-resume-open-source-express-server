import type { Pool } from 'pg';
import { selectRowsFrom } from '../../utils/postgres';

export type TechnicalSkillsResponseListRow = {
  id: string;
  structured: unknown;
  created_at: string;
};

/**
 * Fetch technical skills response rows by ids.
 */
export const listTechnicalSkillsResponsesByIds = async (
  pool: Pool,
  ids: string[],
): Promise<TechnicalSkillsResponseListRow[]> => {
  if (ids.length === 0) return [];

  try {
    return await selectRowsFrom<TechnicalSkillsResponseListRow>(pool, 'technical_skills_responses', {
      columns: 'id, structured, created_at',
      in: { id: ids },
    });
  } catch (error) {
    console.error('❌ listTechnicalSkillsResponsesByIds:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
