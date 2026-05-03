import { SupabaseClient } from '@supabase/supabase-js';

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
  supabase: SupabaseClient,
  responseIds: string[],
): Promise<UserBackgroundSegmentSuggestionRow[]> => {
  if (responseIds.length === 0) return [];

  const { data, error } = await supabase
    .from('user_background_segment_suggestions')
    .select(
      'id, profile_id, exchange_id, response_id, segment_key, title, body, op, target_item_id, status, created_at',
    )
    .in('response_id', responseIds)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ listUserBackgroundSegmentSuggestionsByResponseIds:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as UserBackgroundSegmentSuggestionRow[];
};
