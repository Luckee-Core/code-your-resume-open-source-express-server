import type { Pool } from 'pg';
import { selectOneFrom } from '../../utils/postgres';
import type { JobListingAiPrompt } from './types';

/**
 * Returns the active job listing AI prompt, or null.
 */
export const getActiveJobListingAiPrompt = async (
  pool: Pool,
): Promise<JobListingAiPrompt | null> => {
  try {
    return await selectOneFrom<JobListingAiPrompt>(pool, 'job_listing_ai_prompt', {
      eq: { is_active: true },
      order: [{ column: 'version', ascending: false }],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
};
