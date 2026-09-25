import type { Pool } from 'pg';
import { selectOneFrom } from '../../utils/postgres';

/**
 * Return max sort_order for active items in a segment, or -1 if none.
 */
export const getMaxSortOrderForUserBackgroundSegment = async (
  pool: Pool,
  profileId: string,
  segmentKey: string,
): Promise<number> => {
  try {
    const row = await selectOneFrom<{ sort_order: number }>(pool, 'user_background_segment_items', {
      columns: 'sort_order',
      eq: { profile_id: profileId, segment_key: segmentKey, status: 'active' },
      order: [{ column: 'sort_order', ascending: false }],
    });
    return row?.sort_order ?? -1;
  } catch (error) {
    console.error('❌ getMaxSortOrderForUserBackgroundSegment:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
