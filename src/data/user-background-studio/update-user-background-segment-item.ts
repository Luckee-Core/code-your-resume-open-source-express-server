import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Update title/body for an existing segment item.
 */
export const updateUserBackgroundSegmentItem = async (
  supabase: SupabaseClient,
  itemId: string,
  patch: { title?: string; body?: string | null; sourceExchangeId?: string | null },
): Promise<void> => {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.body !== undefined) row.body = patch.body;
  if (patch.sourceExchangeId !== undefined) row.source_exchange_id = patch.sourceExchangeId;

  const { error } = await supabase.from('user_background_segment_items').update(row).eq('id', itemId);

  if (error) {
    console.error('❌ updateUserBackgroundSegmentItem:', error);
    throw new Error(error.message);
  }
};
