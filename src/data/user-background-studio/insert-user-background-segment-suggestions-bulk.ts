import { SupabaseClient } from '@supabase/supabase-js';

export type UserBackgroundSegmentSuggestionInsert = {
  id: string;
  segmentKey: string;
  title: string;
  body: string | null;
  op: 'add' | 'update';
  targetItemId?: string | null;
};

/**
 * Insert pending segment suggestions tied to a coach exchange/response.
 */
export const insertUserBackgroundSegmentSuggestionsBulk = async (
  supabase: SupabaseClient,
  params: {
    profileId: string;
    exchangeId: string;
    responseId: string;
    suggestions: UserBackgroundSegmentSuggestionInsert[];
  },
): Promise<void> => {
  if (params.suggestions.length === 0) return;

  const now = new Date().toISOString();
  const rows = params.suggestions.map((s) => ({
    id: s.id,
    profile_id: params.profileId,
    exchange_id: params.exchangeId,
    response_id: params.responseId,
    segment_key: s.segmentKey,
    title: s.title,
    body: s.body,
    op: s.op,
    target_item_id: s.targetItemId ?? null,
    status: 'pending',
    created_at: now,
  }));

  const { error } = await supabase.from('user_background_segment_suggestions').insert(rows);
  if (error) {
    console.error('❌ insertUserBackgroundSegmentSuggestionsBulk:', error);
    throw new Error(error.message);
  }
};
