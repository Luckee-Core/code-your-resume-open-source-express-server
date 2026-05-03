import { SupabaseClient } from '@supabase/supabase-js';

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
  supabase: SupabaseClient,
  profileId: string,
): Promise<UserBackgroundSegmentItemRow[]> => {
  const { data, error } = await supabase
    .from('user_background_segment_items')
    .select(
      'id, profile_id, segment_key, sort_order, title, body, metadata, status, source_exchange_id, created_at, updated_at',
    )
    .eq('profile_id', profileId)
    .order('segment_key', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('❌ listUserBackgroundSegmentItemsForProfile:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as UserBackgroundSegmentItemRow[];
};
