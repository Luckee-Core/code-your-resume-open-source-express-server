import type { SupabaseClient } from '@supabase/supabase-js';
import type { Job } from '../types';
import { mapJobRow } from './map-job-row';

/**
 * Find a job by exact posting URL.
 */
export const findJobByUrlFromSupabase = async (
  supabase: SupabaseClient,
  url: string
): Promise<Job | null> => {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const { data, error } = await supabase
    .from('jobs')
    .select(
      'id, company_id, title, url, status, description, listing_imported_at, latest_scrape_run_id, latest_ai_exchange_id, created_at, updated_at',
    )
    .eq('url', trimmed)
    .maybeSingle();

  if (error) {
    console.error('❌ findJobByUrlFromSupabase:', error.message);
    throw new Error(error.message);
  }

  return data ? mapJobRow(data) : null;
};
