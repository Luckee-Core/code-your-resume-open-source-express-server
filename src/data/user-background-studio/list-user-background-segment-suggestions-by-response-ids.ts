import type { Pool } from 'pg';
import { selectRowsFrom } from '../../utils/postgres';

export type UserBackgroundSegmentSuggestionRow = {
  id: string;
  profile_id: string;
  exchange_id: string;
  response_id: string;
  segment_key: string;
  title: string;
  body: string | null;
  op: string;
  target_item_id: string | null;
  status: string;
  created_at: string;
};

/**
 * List segment suggestions for the given coach response ids (typically pending only in UI).
 */
export const listUserBackgroundSegmentSuggestionsByResponseIds = async (
  pool: Pool,
  responseIds: string[],
): Promise<UserBackgroundSegmentSuggestionRow[]> => {
  if (responseIds.length === 0) return [];

  try {
    return await selectRowsFrom<UserBackgroundSegmentSuggestionRow>(
      pool,
      'user_background_segment_suggestions',
      {
        columns:
          'id, profile_id, exchange_id, response_id, segment_key, title, body, op, target_item_id, status, created_at',
        in: { response_id: responseIds },
        order: [{ column: 'created_at', ascending: true }],
      },
    );
  } catch (error) {
    console.error('❌ listUserBackgroundSegmentSuggestionsByResponseIds:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
