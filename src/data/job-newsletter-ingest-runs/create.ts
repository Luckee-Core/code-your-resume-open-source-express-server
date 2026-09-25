import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';
import type { CreateJobNewsletterIngestRunInput, JobNewsletterIngestRun } from './types';

/**
 * Insert a new job newsletter ingest run row.
 */
export const createJobNewsletterIngestRun = async (
  pool: Pool,
  input: CreateJobNewsletterIngestRunInput,
): Promise<JobNewsletterIngestRun> => {
  try {
    return await insertRow<JobNewsletterIngestRun>(pool, 'job_newsletter_ingest_runs', {
      source_id: input.source_id,
      status: input.status ?? 'running',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message || 'Failed to create job_newsletter_ingest_runs row');
  }
};
