import type { Pool } from 'pg';
import { selectOneFrom } from '../../utils/postgres';
import type { UserBackgroundSegmentSuggestionRow } from './list-user-background-segment-suggestions-by-response-ids';
import { getUserBackgroundProfileOwnedByUser } from './get-user-background-profile-owned-by-user';

/**
 * Load a single suggestion row if it belongs to a profile owned by the user.
 */
export const getUserBackgroundSegmentSuggestionForUser = async (
  pool: Pool,
  suggestionId: string,
  userId: string,
): Promise<UserBackgroundSegmentSuggestionRow | null> => {
  let row: UserBackgroundSegmentSuggestionRow | null;
  try {
    row = await selectOneFrom<UserBackgroundSegmentSuggestionRow>(
      pool,
      'user_background_segment_suggestions',
      {
        columns:
          'id, profile_id, exchange_id, response_id, segment_key, title, body, op, target_item_id, status, created_at',
        eq: { id: suggestionId },
      },
    );
  } catch (error) {
    console.error('❌ getUserBackgroundSegmentSuggestionForUser:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }

  if (!row) return null;

  const profile = await getUserBackgroundProfileOwnedByUser(pool, row.profile_id, userId);
  if (!profile) {
    return null;
  }

  return row;
};
