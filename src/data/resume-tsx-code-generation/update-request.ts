import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Mark a resume TSX code generation request as completed.
 *
 * @param supabase - Supabase service-role client
 * @param id - Request ID
 */
export const updateResumeTsxRequestCompleted = async (
  supabase: SupabaseClient,
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from('resume_tsx_code_generation_requests')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('❌ updateResumeTsxRequestCompleted:', error.message);
    throw new Error(`Failed to update request record: ${error.message}`);
  }
};

/**
 * Mark a resume TSX code generation request as failed.
 *
 * @param supabase - Supabase service-role client
 * @param id - Request ID
 */
export const updateResumeTsxRequestFailed = async (
  supabase: SupabaseClient,
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from('resume_tsx_code_generation_requests')
    .update({ status: 'failed', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('❌ updateResumeTsxRequestFailed:', error.message);
  }
};
