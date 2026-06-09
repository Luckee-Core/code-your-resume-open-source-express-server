import type { SupabaseClient } from '@supabase/supabase-js';
import type { JobNewsletterIngestRun, UpdateJobNewsletterIngestRunInput } from './types';

/**
 * Update an existing job newsletter ingest run row.
 */
export const updateJobNewsletterIngestRun = async (
  supabase: SupabaseClient,
  id: string,
  input: UpdateJobNewsletterIngestRunInput,
): Promise<JobNewsletterIngestRun> => {
  const { data, error } = await supabase
    .from('job_newsletter_ingest_runs')
    .update(input)
    .eq('id', id)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to update job_newsletter_ingest_runs row');
  }

  return data as JobNewsletterIngestRun;
};
