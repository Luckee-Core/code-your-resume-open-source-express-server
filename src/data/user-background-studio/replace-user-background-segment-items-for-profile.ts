import { SupabaseClient } from '@supabase/supabase-js';

export type UserBackgroundSegmentItemInsert = {
  id: string;
  segmentKey: string;
  sortOrder: number;
  title: string;
  body: string | null;
  status: 'active' | 'archived';
  metadata?: Record<string, unknown>;
  sourceExchangeId?: string | null;
};

/**
 * Replace all segment items for a profile with the provided set (full sync from client).
 */
export const replaceUserBackgroundSegmentItemsForProfile = async (
  supabase: SupabaseClient,
  profileId: string,
  items: UserBackgroundSegmentItemInsert[],
): Promise<void> => {
  const { error: delErr } = await supabase.from('user_background_segment_items').delete().eq('profile_id', profileId);
  if (delErr) {
    console.error('❌ replaceUserBackgroundSegmentItemsForProfile delete:', delErr);
    throw new Error(delErr.message);
  }

  if (items.length === 0) {
    return;
  }

  const now = new Date().toISOString();
  const rows = items.map((i) => ({
    id: i.id,
    profile_id: profileId,
    segment_key: i.segmentKey,
    sort_order: i.sortOrder,
    title: i.title,
    body: i.body,
    metadata: i.metadata ?? {},
    status: i.status,
    source_exchange_id: i.sourceExchangeId ?? null,
    created_at: now,
    updated_at: now,
  }));

  const { error: insErr } = await supabase.from('user_background_segment_items').insert(rows);
  if (insErr) {
    console.error('❌ replaceUserBackgroundSegmentItemsForProfile insert:', insErr);
    throw new Error(insErr.message);
  }
};
