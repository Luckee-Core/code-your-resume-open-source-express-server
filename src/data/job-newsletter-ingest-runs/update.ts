import type { Pool } from 'pg';
import { selectOneFrom, updateRows } from '../../utils/postgres';
import type { JobNewsletterIngestRun, UpdateJobNewsletterIngestRunInput } from './types';

/**
 * Update an existing job newsletter ingest run row.
 */
export const updateJobNewsletterIngestRun = async (
  pool: Pool,
  id: string,
  input: UpdateJobNewsletterIngestRunInput,
): Promise<JobNewsletterIngestRun> => {
  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) updates[key] = value;
  }

  try {
    if (Object.keys(updates).length > 0) {
      await updateRows(pool, 'job_newsletter_ingest_runs', updates, { id });
    }
    const data = await selectOneFrom<JobNewsletterIngestRun>(pool, 'job_newsletter_ingest_runs', {
      eq: { id },
    });
    if (!data) {
      throw new Error('Failed to update job_newsletter_ingest_runs row');
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message || 'Failed to update job_newsletter_ingest_runs row');
  }
};
