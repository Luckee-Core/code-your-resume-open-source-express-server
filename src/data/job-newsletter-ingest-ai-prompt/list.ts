import type { SupabaseClient } from '@supabase/supabase-js';
import { isMissingTableError } from '../../utils/supabase/is-missing-table-error';
import type { JobNewsletterIngestAiPrompt } from './types';

/**
 * List all job newsletter ingest AI prompt versions.
 */
export const listJobNewsletterIngestAiPrompts = async (
  supabase: SupabaseClient,
): Promise<JobNewsletterIngestAiPrompt[]> => {
  const { data, error } = await supabase
    .from('job_newsletter_ingest_ai_prompt')
    .select('*')
    .order('name', { ascending: true })
    .order('version', { ascending: false });

  if (error) {
    if (isMissingTableError(error)) {
      console.warn('⚠️ job_newsletter_ingest_ai_prompt table missing; returning [].');
      return [];
    }
    throw new Error(error.message);
  }

  return (data ?? []) as JobNewsletterIngestAiPrompt[];
};
