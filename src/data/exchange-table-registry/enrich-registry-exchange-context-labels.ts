import type { SupabaseClient } from '@supabase/supabase-js';
import { batchFetchRowsByIds } from '../../utils/supabase/batch-fetch-rows-by-ids';
import type { RegistryExchangeSourceRow } from './list-exchange-rows-from-registry-entry';

/**
 * Resolves human-readable context labels for registry exchange rows (job title, profile name, etc.).
 */
export const enrichRegistryExchangeContextLabels = async (
  supabase: SupabaseClient,
  rows: RegistryExchangeSourceRow[],
): Promise<Map<string, string>> => {
  const labels = new Map<string, string>();

  const jobIds = rows.map((row) => row.job_id ?? '').filter(Boolean);
  const profileIds = rows.map((row) => row.profile_id ?? '').filter(Boolean);

  let jobById = new Map<string, Record<string, unknown>>();
  let profileById = new Map<string, Record<string, unknown>>();

  try {
    if (jobIds.length > 0) {
      jobById = await batchFetchRowsByIds(supabase, 'jobs', jobIds, 'id, title');
    }
    if (profileIds.length > 0) {
      profileById = await batchFetchRowsByIds(
        supabase,
        'user_background_profiles',
        profileIds,
        'id, name',
      );
    }
  } catch {
    return labels;
  }

  for (const row of rows) {
    if (row.context_label) {
      labels.set(row.exchange_id, row.context_label);
      continue;
    }

    if (row.job_id) {
      const job = jobById.get(row.job_id);
      const title = typeof job?.title === 'string' && job.title.trim() ? job.title.trim() : null;
      if (title) {
        labels.set(row.exchange_id, title);
        continue;
      }
    }

    if (row.profile_id) {
      const profile = profileById.get(row.profile_id);
      const name = typeof profile?.name === 'string' && profile.name.trim() ? profile.name.trim() : null;
      if (name) {
        labels.set(row.exchange_id, name);
      }
    }
  }

  return labels;
};
