import type { Pool } from 'pg';
import { selectRowsFrom } from '../../utils/postgres';
import type { JobNewsletterIngestRun } from './types';

/**
 * List ingest runs for a newsletter source (newest first).
 */
export const listJobNewsletterIngestRunsBySourceId = async (
  pool: Pool,
  sourceId: string,
  limit = 50,
): Promise<JobNewsletterIngestRun[]> => {
  const capped = Math.min(Math.max(limit, 1), 200);
  try {
    return await selectRowsFrom<JobNewsletterIngestRun>(pool, 'job_newsletter_ingest_runs', {
      eq: { source_id: sourceId },
      order: [{ column: 'started_at', ascending: false }],
      limit: capped,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
};
