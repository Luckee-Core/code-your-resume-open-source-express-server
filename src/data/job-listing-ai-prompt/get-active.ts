import type { SupabaseClient } from '@supabase/supabase-js';
import type { JobListingAiPrompt } from './types';

/**
 * Returns the active job listing AI prompt, or null.
 */
export const getActiveJobListingAiPrompt = async (
  supabase: SupabaseClient,
): Promise<JobListingAiPrompt | null> => {
  const { data, error } = await supabase
    .from('job_listing_ai_prompt')
    .select('*')
    .eq('is_active', true)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as JobListingAiPrompt | null) ?? null;
};
