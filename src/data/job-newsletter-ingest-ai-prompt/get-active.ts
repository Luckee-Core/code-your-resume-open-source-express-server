import type { SupabaseClient } from '@supabase/supabase-js';
import type { JobNewsletterIngestAiPrompt } from './types';

/**
 * Returns the active job newsletter ingest AI prompt, or null.
 */
export const getActiveJobNewsletterIngestAiPrompt = async (
  supabase: SupabaseClient,
): Promise<JobNewsletterIngestAiPrompt | null> => {
  const { data, error } = await supabase
    .from('job_newsletter_ingest_ai_prompt')
    .select('*')
    .eq('is_active', true)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as JobNewsletterIngestAiPrompt | null) ?? null;
};
