import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateJobNewsletterIngestRunInput, JobNewsletterIngestRun } from './types';

/**
 * Insert a new job newsletter ingest run row.
 */
export const createJobNewsletterIngestRun = async (
  supabase: SupabaseClient,
  input: CreateJobNewsletterIngestRunInput,
): Promise<JobNewsletterIngestRun> => {
  const { data, error } = await supabase
    .from('job_newsletter_ingest_runs')
    .insert({
      source_id: input.source_id,
      status: input.status ?? 'running',
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to create job_newsletter_ingest_runs row');
  }

  return data as JobNewsletterIngestRun;
};
