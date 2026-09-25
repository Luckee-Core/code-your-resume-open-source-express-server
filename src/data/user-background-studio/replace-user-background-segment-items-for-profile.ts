import type { Pool } from 'pg';
import { deleteRows, insertRows } from '../../utils/postgres';

export type UserBackgroundSegmentItemInsert = {
  id: string;
  segmentKey: string;
  sortOrder: number;
  title: string;
  body: string | null;
  status: 'active' | 'archived';
  metadata?: Record<string, unknown>;
  sourceExchangeId?: string | null;
};

/**
 * Replace all segment items for a profile with the provided set (full sync from client).
 */
export const replaceUserBackgroundSegmentItemsForProfile = async (
  pool: Pool,
  profileId: string,
  items: UserBackgroundSegmentItemInsert[],
): Promise<void> => {
  try {
    await deleteRows(pool, 'user_background_segment_items', { profile_id: profileId });
  } catch (error) {
    console.error('❌ replaceUserBackgroundSegmentItemsForProfile delete:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }

  if (items.length === 0) {
    return;
  }

  const now = new Date().toISOString();
  const rows = items.map((i) => ({
    id: i.id,
    profile_id: profileId,
    segment_key: i.segmentKey,
    sort_order: i.sortOrder,
    title: i.title,
    body: i.body,
    metadata: i.metadata ?? {},
    status: i.status,
    source_exchange_id: i.sourceExchangeId ?? null,
    created_at: now,
    updated_at: now,
  }));

  try {
    await insertRows(pool, 'user_background_segment_items', rows);
  } catch (error) {
    console.error('❌ replaceUserBackgroundSegmentItemsForProfile insert:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
