import type { Pool } from 'pg';
import { updateRows } from '../../utils/postgres';

/**
 * Update title/body for an existing segment item.
 */
export const updateUserBackgroundSegmentItem = async (
  pool: Pool,
  itemId: string,
  patch: { title?: string; body?: string | null; sourceExchangeId?: string | null },
): Promise<void> => {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.body !== undefined) row.body = patch.body;
  if (patch.sourceExchangeId !== undefined) row.source_exchange_id = patch.sourceExchangeId;

  try {
    await updateRows(pool, 'user_background_segment_items', row, { id: itemId });
  } catch (error) {
    console.error('❌ updateUserBackgroundSegmentItem:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
