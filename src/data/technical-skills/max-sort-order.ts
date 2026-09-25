import type { Pool } from 'pg';
import { selectOneFrom } from '../../utils/postgres';

/**
 * Return max sort_order for active technical skill rows, or -1 if none.
 */
export const getMaxSortOrderForTechnicalSkills = async (
  pool: Pool,
): Promise<number> => {
  try {
    const row = await selectOneFrom<{ sort_order: number }>(pool, 'technical_skills', {
      columns: 'sort_order',
      eq: { status: 'active' },
      order: [{ column: 'sort_order', ascending: false }],
    });
    return row?.sort_order ?? -1;
  } catch (error) {
    console.error('❌ getMaxSortOrderForTechnicalSkills:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
