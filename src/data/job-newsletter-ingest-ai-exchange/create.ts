import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';
import type {
  CreateJobNewsletterIngestAiExchangeInput,
  JobNewsletterIngestAiExchange,
} from './types';

/**
 * Insert a job newsletter ingest AI exchange row (token ledger).
 */
export const createJobNewsletterIngestAiExchange = async (
  pool: Pool,
  input: CreateJobNewsletterIngestAiExchangeInput,
): Promise<JobNewsletterIngestAiExchange> => {
  try {
    return await insertRow<JobNewsletterIngestAiExchange>(
      pool,
      'job_newsletter_ingest_ai_exchanges',
      {
        source_id: input.source_id,
        run_id: input.run_id ?? null,
        gmail_message_id: input.gmail_message_id,
        prompt_id: input.prompt_id ?? null,
        model: input.model ?? null,
        input_tokens: input.input_tokens ?? null,
        output_tokens: input.output_tokens ?? null,
        status: input.status,
        context_label: input.context_label ?? null,
        error_message: input.error_message ?? null,
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message || 'Failed to create job_newsletter_ingest_ai_exchanges row');
  }
};
