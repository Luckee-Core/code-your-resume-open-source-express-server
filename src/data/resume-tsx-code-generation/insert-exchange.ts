import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertResumeTsxExchangeInput = {
  id: string;
  requestId: string;
  agentId: string;
};

/**
 * Insert a new resume TSX code generation exchange record (status: running).
 *
 * @param supabase - Supabase service-role client
 * @param input - Exchange fields
 */
export const insertResumeTsxExchange = async (
  supabase: SupabaseClient,
  input: InsertResumeTsxExchangeInput,
): Promise<void> => {
  const { error } = await supabase.from('resume_tsx_code_generation_exchanges').insert({
    id: input.id,
    request_id: input.requestId,
    agent_id: input.agentId,
    status: 'running',
  });

  if (error) {
    console.error('❌ insertResumeTsxExchange:', error.message);
    throw new Error(`Failed to insert exchange record: ${error.message}`);
  }
};
