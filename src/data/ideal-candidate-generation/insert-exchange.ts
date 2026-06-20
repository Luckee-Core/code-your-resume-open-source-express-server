import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertIdealCandidateExchangeInput = {
  id: string;
  jobId: string;
  requestId: string;
  agentId: string;
};

/**
 * Insert a new ideal candidate generation exchange record (status: running).
 *
 * @param supabase - Supabase service-role client
 * @param input - Exchange fields
 */
export const insertIdealCandidateExchange = async (
  supabase: SupabaseClient,
  input: InsertIdealCandidateExchangeInput,
): Promise<void> => {
  const { error } = await supabase.from('ideal_candidate_generation_exchanges').insert({
    id: input.id,
    job_id: input.jobId,
    request_id: input.requestId,
    agent_id: input.agentId,
    status: 'running',
  });

  if (error) {
    console.error('❌ insertIdealCandidateExchange:', error.message);
    throw new Error(`Failed to insert ideal candidate exchange record: ${error.message}`);
  }
};
