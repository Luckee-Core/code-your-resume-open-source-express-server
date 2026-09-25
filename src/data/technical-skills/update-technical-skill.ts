import type { Pool } from 'pg';
import { updateRows } from '../../utils/postgres';

/**
 * Update title/body for an existing technical skill row.
 */
export const updateTechnicalSkill = async (
  pool: Pool,
  skillId: string,
  patch: { title?: string; body?: string | null; sourceExchangeId?: string | null },
): Promise<void> => {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.body !== undefined) row.body = patch.body;
  if (patch.sourceExchangeId !== undefined) row.source_exchange_id = patch.sourceExchangeId;

  try {
    await updateRows(pool, 'technical_skills', row, { id: skillId });
  } catch (error) {
    console.error('❌ updateTechnicalSkill:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
