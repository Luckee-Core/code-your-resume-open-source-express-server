import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

/**
 * Insert a single segment item row.
 */
export const insertUserBackgroundSegmentItem = async (
  pool: Pool,
  params: {
    id: string;
    profileId: string;
    segmentKey: string;
    sortOrder: number;
    title: string;
    body: string | null;
    status: 'active' | 'archived';
    sourceExchangeId?: string | null;
    metadata?: Record<string, unknown>;
  },
): Promise<void> => {
  const now = new Date().toISOString();
  try {
    await insertRow(pool, 'user_background_segment_items', {
      id: params.id,
      profile_id: params.profileId,
      segment_key: params.segmentKey,
      sort_order: params.sortOrder,
      title: params.title,
      body: params.body,
      metadata: params.metadata ?? {},
      status: params.status,
      source_exchange_id: params.sourceExchangeId ?? null,
      created_at: now,
      updated_at: now,
    });
  } catch (error) {
    console.error('❌ insertUserBackgroundSegmentItem:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
