import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertCompanyInterestResponseInput = {
  id: string;
  tsxCode: string;
  agentSummary: string | null;
};

/**
 * Insert a company interest generation response record containing extracted TSX.
 *
 * @param supabase - Supabase service-role client
 * @param input - Response fields
 */
export const insertCompanyInterestResponse = async (
  supabase: SupabaseClient,
  input: InsertCompanyInterestResponseInput,
): Promise<void> => {
  const { error } = await supabase.from('company_interest_generation_responses').insert({
    id: input.id,
    tsx_code: input.tsxCode,
    agent_summary: input.agentSummary,
  });

  if (error) {
    console.error('❌ insertCompanyInterestResponse:', error.message);
    throw new Error(`Failed to insert company interest response record: ${error.message}`);
  }
};
