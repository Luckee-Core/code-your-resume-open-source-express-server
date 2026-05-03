import { SupabaseClient } from '@supabase/supabase-js';
import type { UserBackgroundSegmentSuggestionRow } from './list-user-background-segment-suggestions-by-response-ids';
import { getUserBackgroundProfileOwnedByUser } from './get-user-background-profile-owned-by-user';

/**
 * Load a single suggestion row if it belongs to a profile owned by the user.
 */
export const getUserBackgroundSegmentSuggestionForUser = async (
  supabase: SupabaseClient,
  suggestionId: string,
  userId: string,
): Promise<UserBackgroundSegmentSuggestionRow | null> => {
  const { data, error } = await supabase
    .from('user_background_segment_suggestions')
    .select(
      'id, profile_id, exchange_id, response_id, segment_key, title, body, op, target_item_id, status, created_at',
    )
    .eq('id', suggestionId)
    .maybeSingle();

  if (error) {
    console.error('❌ getUserBackgroundSegmentSuggestionForUser:', error);
    throw new Error(error.message);
  }

  if (!data) return null;

  const row = data as UserBackgroundSegmentSuggestionRow;
  const profile = await getUserBackgroundProfileOwnedByUser(supabase, row.profile_id, userId);
  if (!profile) {
    return null;
  }

  return row;
};
