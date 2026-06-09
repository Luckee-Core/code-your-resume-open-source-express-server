import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Mark a company interest generation request as completed.
 *
 * @param supabase - Supabase service-role client
 * @param id - Request ID
 */
export const updateCompanyInterestRequestCompleted = async (
  supabase: SupabaseClient,
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from('company_interest_generation_requests')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('❌ updateCompanyInterestRequestCompleted:', error.message);
    throw new Error(`Failed to update company interest request record: ${error.message}`);
  }
};

/**
 * Mark a company interest generation request as failed.
 *
 * @param supabase - Supabase service-role client
 * @param id - Request ID
 */
export const updateCompanyInterestRequestFailed = async (
  supabase: SupabaseClient,
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from('company_interest_generation_requests')
    .update({ status: 'failed', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('❌ updateCompanyInterestRequestFailed:', error.message);
  }
};
