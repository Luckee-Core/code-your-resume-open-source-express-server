import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertIdealCandidateResponseInput = {
  id: string;
  tsxCode: string;
  agentSummary: string | null;
};

/**
 * Insert an ideal candidate generation response record containing extracted TSX.
 *
 * @param supabase - Supabase service-role client
 * @param input - Response fields
 */
export const insertIdealCandidateResponse = async (
  supabase: SupabaseClient,
  input: InsertIdealCandidateResponseInput,
): Promise<void> => {
  const { error } = await supabase.from('ideal_candidate_generation_responses').insert({
    id: input.id,
    tsx_code: input.tsxCode,
    agent_summary: input.agentSummary,
  });

  if (error) {
    console.error('❌ insertIdealCandidateResponse:', error.message);
    throw new Error(`Failed to insert ideal candidate response record: ${error.message}`);
  }
};
