import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertCompanyInterestExchangeInput = {
  id: string;
  jobId: string;
  requestId: string;
  agentId: string;
};

/**
 * Insert a new company interest generation exchange record (status: running).
 *
 * @param supabase - Supabase service-role client
 * @param input - Exchange fields
 */
export const insertCompanyInterestExchange = async (
  supabase: SupabaseClient,
  input: InsertCompanyInterestExchangeInput,
): Promise<void> => {
  const { error } = await supabase.from('company_interest_generation_exchanges').insert({
    id: input.id,
    job_id: input.jobId,
    request_id: input.requestId,
    agent_id: input.agentId,
    status: 'running',
  });

  if (error) {
    console.error('❌ insertCompanyInterestExchange:', error.message);
    throw new Error(`Failed to insert company interest exchange record: ${error.message}`);
  }
};
