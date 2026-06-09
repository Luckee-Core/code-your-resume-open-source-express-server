export type JobNewsletterIngestAiExchangeStatus = 'completed' | 'failed' | 'skipped';

export type JobNewsletterIngestAiExchange = {
  id: string;
  source_id: string;
  run_id: string | null;
  gmail_message_id: string;
  prompt_id: string | null;
  model: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  status: JobNewsletterIngestAiExchangeStatus;
  context_label: string | null;
  error_message: string | null;
  occurred_at: string;
  created_at: string;
};

export type CreateJobNewsletterIngestAiExchangeInput = {
  source_id: string;
  run_id?: string | null;
  gmail_message_id: string;
  prompt_id?: string | null;
  model?: string | null;
  input_tokens?: number | null;
  output_tokens?: number | null;
  status: JobNewsletterIngestAiExchangeStatus;
  context_label?: string | null;
  error_message?: string | null;
};
