import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Mark an ideal candidate generation request as completed.
 *
 * @param supabase - Supabase service-role client
 * @param id - Request ID
 */
export const updateIdealCandidateRequestCompleted = async (
  supabase: SupabaseClient,
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from('ideal_candidate_generation_requests')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('❌ updateIdealCandidateRequestCompleted:', error.message);
    throw new Error(`Failed to update ideal candidate request record: ${error.message}`);
  }
};

/**
 * Mark an ideal candidate generation request as failed.
 *
 * @param supabase - Supabase service-role client
 * @param id - Request ID
 */
export const updateIdealCandidateRequestFailed = async (
  supabase: SupabaseClient,
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from('ideal_candidate_generation_requests')
    .update({ status: 'failed', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('❌ updateIdealCandidateRequestFailed:', error.message);
  }
};
