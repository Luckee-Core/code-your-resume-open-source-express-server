import type { Pool } from 'pg';
import { isMissingTableError, selectRowsFrom } from '../../utils/postgres';
import type { JobNewsletterIngestAiPrompt } from './types';

/**
 * List all job newsletter ingest AI prompt versions.
 */
export const listJobNewsletterIngestAiPrompts = async (
  pool: Pool,
): Promise<JobNewsletterIngestAiPrompt[]> => {
  try {
    return await selectRowsFrom<JobNewsletterIngestAiPrompt>(
      pool,
      'job_newsletter_ingest_ai_prompt',
      {
        order: [
          { column: 'name', ascending: true },
          { column: 'version', ascending: false },
        ],
      },
    );
  } catch (error) {
    const err = error as { code?: string; message?: string };
    if (isMissingTableError(err)) {
      console.warn('⚠️ job_newsletter_ingest_ai_prompt table missing; returning [].');
      return [];
    }
    throw new Error(err.message ?? String(error));
  }
};
