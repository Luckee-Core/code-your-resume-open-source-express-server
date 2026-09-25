import type { Pool } from 'pg';
import { updateRows } from '../../utils/postgres';

/**
 * Update suggestion workflow status.
 */
export const updateUserBackgroundSegmentSuggestionStatus = async (
  pool: Pool,
  suggestionId: string,
  status: 'accepted' | 'rejected',
): Promise<void> => {
  try {
    await updateRows(pool, 'user_background_segment_suggestions', { status }, { id: suggestionId });
  } catch (error) {
    console.error('❌ updateUserBackgroundSegmentSuggestionStatus:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
