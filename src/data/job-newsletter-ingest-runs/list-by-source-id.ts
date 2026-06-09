import type { SupabaseClient } from '@supabase/supabase-js';
import type { JobNewsletterIngestRun } from './types';

/**
 * List ingest runs for a newsletter source (newest first).
 */
export const listJobNewsletterIngestRunsBySourceId = async (
  supabase: SupabaseClient,
  sourceId: string,
  limit = 50,
): Promise<JobNewsletterIngestRun[]> => {
  const capped = Math.min(Math.max(limit, 1), 200);
  const { data, error } = await supabase
    .from('job_newsletter_ingest_runs')
    .select('*')
    .eq('source_id', sourceId)
    .order('started_at', { ascending: false })
    .limit(capped);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as JobNewsletterIngestRun[];
};
