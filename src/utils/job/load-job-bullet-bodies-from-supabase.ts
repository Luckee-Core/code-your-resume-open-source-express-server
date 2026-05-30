import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Loads non-empty bullet body strings for one job from a Supabase mirror table.
 *
 * @param supabase - Supabase client
 * @param jobId - Job id
 * @param table - `job_responsibilities`, `job_requirements`, or `job_nice_to_have`
 * @returns Body strings in sort_order
 */
export const loadJobBulletBodiesFromSupabase = async (
  supabase: SupabaseClient,
  jobId: string,
  table: string,
): Promise<string[]> => {
  const { data, error } = await supabase
    .from(table)
    .select('body')
    .eq('job_id', jobId)
    .order('sort_order');

  if (error) {
    console.warn(`⚠️ loadJobBulletBodiesFromSupabase ${table}:`, error.message);
    return [];
  }

  return (data ?? []).map((r: { body: string }) => r.body).filter(Boolean);
};
