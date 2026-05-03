import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Return max sort_order for active items in a segment, or -1 if none.
 */
export const getMaxSortOrderForUserBackgroundSegment = async (
  supabase: SupabaseClient,
  profileId: string,
  segmentKey: string,
): Promise<number> => {
  const { data, error } = await supabase
    .from('user_background_segment_items')
    .select('sort_order')
    .eq('profile_id', profileId)
    .eq('segment_key', segmentKey)
    .eq('status', 'active')
    .order('sort_order', { ascending: false })
    .limit(1);

  if (error) {
    console.error('❌ getMaxSortOrderForUserBackgroundSegment:', error);
    throw new Error(error.message);
  }

  const row = data?.[0] as { sort_order: number } | undefined;
  return row?.sort_order ?? -1;
};
