import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Mark a skills component generation request as completed.
 *
 * @param supabase - Supabase service-role client
 * @param id - Request ID
 */
export const updateSkillsComponentRequestCompleted = async (
  supabase: SupabaseClient,
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from('skills_component_generation_requests')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('❌ updateSkillsComponentRequestCompleted:', error.message);
    throw new Error(`Failed to update skills component request record: ${error.message}`);
  }
};

/**
 * Mark a skills component generation request as failed.
 *
 * @param supabase - Supabase service-role client
 * @param id - Request ID
 */
export const updateSkillsComponentRequestFailed = async (
  supabase: SupabaseClient,
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from('skills_component_generation_requests')
    .update({ status: 'failed', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('❌ updateSkillsComponentRequestFailed:', error.message);
  }
};
