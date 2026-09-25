import type { Pool } from 'pg';
import { selectRowsFrom } from '../../utils/postgres';
import type { JobNewsletterIngestAiExchange } from './types';

/**
 * List AI exchanges for a newsletter source (newest first).
 */
export const listJobNewsletterIngestAiExchangesBySourceId = async (
  pool: Pool,
  sourceId: string,
  limit = 100,
): Promise<JobNewsletterIngestAiExchange[]> => {
  const capped = Math.min(Math.max(limit, 1), 200);
  try {
    return await selectRowsFrom<JobNewsletterIngestAiExchange>(
      pool,
      'job_newsletter_ingest_ai_exchanges',
      {
        eq: { source_id: sourceId },
        order: [{ column: 'occurred_at', ascending: false }],
        limit: capped,
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
};
