import type { SupabaseClient } from '@supabase/supabase-js';
import { isMissingTableError } from '../../utils/supabase/is-missing-table-error';
import type { JobListingAiPrompt } from './types';

/**
 * List all job listing AI prompt versions.
 */
export const listJobListingAiPrompts = async (
  supabase: SupabaseClient,
): Promise<JobListingAiPrompt[]> => {
  const { data, error } = await supabase
    .from('job_listing_ai_prompt')
    .select('*')
    .order('name', { ascending: true })
    .order('version', { ascending: false });

  if (error) {
    if (isMissingTableError(error)) {
      console.warn('⚠️ job_listing_ai_prompt table missing; returning [].');
      return [];
    }
    throw new Error(error.message);
  }

  return (data ?? []) as JobListingAiPrompt[];
};
