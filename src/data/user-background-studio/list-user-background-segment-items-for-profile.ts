import type { Pool } from 'pg';
import { selectRowsFrom } from '../../utils/postgres';

export type UserBackgroundSegmentItemRow = {
  id: string;
  profile_id: string;
  segment_key: string;
  sort_order: number;
  title: string;
  body: string | null;
  metadata: Record<string, unknown>;
  status: string;
  source_exchange_id: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * List segment item rows for a profile (active first by segment + sort_order).
 */
export const listUserBackgroundSegmentItemsForProfile = async (
  pool: Pool,
  profileId: string,
): Promise<UserBackgroundSegmentItemRow[]> => {
  try {
    return await selectRowsFrom<UserBackgroundSegmentItemRow>(pool, 'user_background_segment_items', {
      columns:
        'id, profile_id, segment_key, sort_order, title, body, metadata, status, source_exchange_id, created_at, updated_at',
      eq: { profile_id: profileId },
      order: [
        { column: 'segment_key', ascending: true },
        { column: 'sort_order', ascending: true },
      ],
    });
  } catch (error) {
    console.error('❌ listUserBackgroundSegmentItemsForProfile:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
