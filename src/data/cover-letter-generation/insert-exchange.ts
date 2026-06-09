import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertCoverLetterExchangeInput = {
  id: string;
  jobId: string;
  requestId: string;
  agentId: string;
};

/**
 * Insert a new cover letter generation exchange record (status: running).
 *
 * @param supabase - Supabase service-role client
 * @param input - Exchange fields
 */
export const insertCoverLetterExchange = async (
  supabase: SupabaseClient,
  input: InsertCoverLetterExchangeInput,
): Promise<void> => {
  const { error } = await supabase.from('cover_letter_generation_exchanges').insert({
    id: input.id,
    job_id: input.jobId,
    request_id: input.requestId,
    agent_id: input.agentId,
    status: 'running',
  });

  if (error) {
    console.error('❌ insertCoverLetterExchange:', error.message);
    throw new Error(`Failed to insert cover letter exchange record: ${error.message}`);
  }
};
