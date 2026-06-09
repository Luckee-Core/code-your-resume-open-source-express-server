import type { SupabaseClient } from '@supabase/supabase-js';
import type { JobNewsletterIngestAiExchange } from './types';

/**
 * List AI exchanges for a newsletter source (newest first).
 */
export const listJobNewsletterIngestAiExchangesBySourceId = async (
  supabase: SupabaseClient,
  sourceId: string,
  limit = 100,
): Promise<JobNewsletterIngestAiExchange[]> => {
  const capped = Math.min(Math.max(limit, 1), 200);
  const { data, error } = await supabase
    .from('job_newsletter_ingest_ai_exchanges')
    .select('*')
    .eq('source_id', sourceId)
    .order('occurred_at', { ascending: false })
    .limit(capped);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as JobNewsletterIngestAiExchange[];
};
