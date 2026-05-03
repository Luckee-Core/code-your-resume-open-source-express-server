import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Update suggestion workflow status.
 */
export const updateUserBackgroundSegmentSuggestionStatus = async (
  supabase: SupabaseClient,
  suggestionId: string,
  status: 'accepted' | 'rejected',
): Promise<void> => {
  const { error } = await supabase
    .from('user_background_segment_suggestions')
    .update({ status })
    .eq('id', suggestionId);

  if (error) {
    console.error('❌ updateUserBackgroundSegmentSuggestionStatus:', error);
    throw new Error(error.message);
  }
};
