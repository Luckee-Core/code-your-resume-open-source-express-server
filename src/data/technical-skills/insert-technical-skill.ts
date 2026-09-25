import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

/**
 * Insert a single technical skill row.
 */
export const insertTechnicalSkill = async (
  pool: Pool,
  params: {
    id: string;
    sortOrder: number;
    title: string;
    body: string | null;
    status: 'active' | 'archived';
    sourceExchangeId?: string | null;
  },
): Promise<void> => {
  const now = new Date().toISOString();
  try {
    await insertRow(pool, 'technical_skills', {
      id: params.id,
      sort_order: params.sortOrder,
      title: params.title,
      body: params.body,
      status: params.status,
      source_exchange_id: params.sourceExchangeId ?? null,
      created_at: now,
      updated_at: now,
    });
  } catch (error) {
    console.error('❌ insertTechnicalSkill:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
