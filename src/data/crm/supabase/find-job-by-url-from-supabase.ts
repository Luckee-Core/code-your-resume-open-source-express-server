import type { Pool } from 'pg';
import type { Job } from '../types';
import { mapJobRow, type JobRow } from './map-job-row';
import { selectOneFrom } from '../../../utils/postgres';

/**
 * Find a job by exact posting URL.
 */
export const findJobByUrlFromSupabase = async (
  pool: Pool,
  url: string
): Promise<Job | null> => {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const data = await selectOneFrom<JobRow>(pool, 'jobs', {
    columns:
      'id, company_id, title, url, status, description, listing_imported_at, latest_scrape_run_id, latest_ai_exchange_id, created_at, updated_at',
    eq: { url: trimmed },
  });

  return data ? mapJobRow(data) : null;
};
