import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertSkillsComponentResponseInput = {
  id: string;
  tsxCode: string;
  agentSummary: string | null;
};

/**
 * Insert a skills component generation response record containing extracted TSX.
 *
 * @param supabase - Supabase service-role client
 * @param input - Response fields
 */
export const insertSkillsComponentResponse = async (
  supabase: SupabaseClient,
  input: InsertSkillsComponentResponseInput,
): Promise<void> => {
  const { error } = await supabase.from('skills_component_generation_responses').insert({
    id: input.id,
    tsx_code: input.tsxCode,
    agent_summary: input.agentSummary,
  });

  if (error) {
    console.error('❌ insertSkillsComponentResponse:', error.message);
    throw new Error(`Failed to insert skills component response record: ${error.message}`);
  }
};
