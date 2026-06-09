import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertSkillsComponentExchangeInput = {
  id: string;
  jobId: string;
  requestId: string;
  agentId: string;
};

/**
 * Insert a new skills component generation exchange record (status: running).
 *
 * @param supabase - Supabase service-role client
 * @param input - Exchange fields
 */
export const insertSkillsComponentExchange = async (
  supabase: SupabaseClient,
  input: InsertSkillsComponentExchangeInput,
): Promise<void> => {
  const { error } = await supabase.from('skills_component_generation_exchanges').insert({
    id: input.id,
    job_id: input.jobId,
    request_id: input.requestId,
    agent_id: input.agentId,
    status: 'running',
  });

  if (error) {
    console.error('❌ insertSkillsComponentExchange:', error.message);
    throw new Error(`Failed to insert skills component exchange record: ${error.message}`);
  }
};
