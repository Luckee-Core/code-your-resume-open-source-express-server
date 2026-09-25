import type { Pool } from 'pg';
import { selectOneFrom } from '../../utils/postgres';
import type { JobNewsletterIngestAiPrompt } from './types';

/**
 * Returns the active job newsletter ingest AI prompt, or null.
 */
export const getActiveJobNewsletterIngestAiPrompt = async (
  pool: Pool,
): Promise<JobNewsletterIngestAiPrompt | null> => {
  try {
    return await selectOneFrom<JobNewsletterIngestAiPrompt>(
      pool,
      'job_newsletter_ingest_ai_prompt',
      {
        eq: { is_active: true },
        order: [{ column: 'version', ascending: false }],
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
};
