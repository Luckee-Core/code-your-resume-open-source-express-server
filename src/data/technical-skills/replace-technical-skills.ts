import type { Pool } from 'pg';
import { insertRows } from '../../utils/postgres';

export type TechnicalSkillInsert = {
  id: string;
  sortOrder: number;
  title: string;
  body: string | null;
  status: 'active' | 'archived';
  sourceExchangeId?: string | null;
};

/**
 * Replace all technical skill rows with the provided set (full sync from client).
 */
export const replaceTechnicalSkills = async (
  pool: Pool,
  items: TechnicalSkillInsert[],
): Promise<void> => {
  try {
    await pool.query('DELETE FROM technical_skills');
  } catch (error) {
    console.error('❌ replaceTechnicalSkills delete:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }

  if (items.length === 0) {
    return;
  }

  const now = new Date().toISOString();
  const rows = items.map((i) => ({
    id: i.id,
    sort_order: i.sortOrder,
    title: i.title,
    body: i.body,
    status: i.status,
    source_exchange_id: i.sourceExchangeId ?? null,
    created_at: now,
    updated_at: now,
  }));

  try {
    await insertRows(pool, 'technical_skills', rows);
  } catch (error) {
    console.error('❌ replaceTechnicalSkills insert:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
