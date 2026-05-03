import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Insert a single segment item row.
 */
export const insertUserBackgroundSegmentItem = async (
  supabase: SupabaseClient,
  params: {
    id: string;
    profileId: string;
    segmentKey: string;
    sortOrder: number;
    title: string;
    body: string | null;
    status: 'active' | 'archived';
    sourceExchangeId?: string | null;
    metadata?: Record<string, unknown>;
  },
): Promise<void> => {
  const now = new Date().toISOString();
  const { error } = await supabase.from('user_background_segment_items').insert({
    id: params.id,
    profile_id: params.profileId,
    segment_key: params.segmentKey,
    sort_order: params.sortOrder,
    title: params.title,
    body: params.body,
    metadata: params.metadata ?? {},
    status: params.status,
    source_exchange_id: params.sourceExchangeId ?? null,
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error('❌ insertUserBackgroundSegmentItem:', error);
    throw new Error(error.message);
  }
};
