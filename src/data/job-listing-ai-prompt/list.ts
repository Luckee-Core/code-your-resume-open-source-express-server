import type { Pool } from 'pg';
import { isMissingTableError, selectRowsFrom } from '../../utils/postgres';
import type { JobListingAiPrompt } from './types';

/**
 * List all job listing AI prompt versions.
 */
export const listJobListingAiPrompts = async (
  pool: Pool,
): Promise<JobListingAiPrompt[]> => {
  try {
    return await selectRowsFrom<JobListingAiPrompt>(pool, 'job_listing_ai_prompt', {
      order: [
        { column: 'name', ascending: true },
        { column: 'version', ascending: false },
      ],
    });
  } catch (error) {
    const err = error as { code?: string; message?: string };
    if (isMissingTableError(err)) {
      console.warn('⚠️ job_listing_ai_prompt table missing; returning [].');
      return [];
    }
    throw new Error(err.message ?? String(error));
  }
};
