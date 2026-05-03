import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertResumeTsxResponseInput = {
  id: string;
  tsxCode: string;
  agentSummary: string | null;
};

/**
 * Insert a new resume TSX code generation response record containing the extracted component code.
 *
 * @param supabase - Supabase service-role client
 * @param input - Response fields including the extracted TSX source
 */
export const insertResumeTsxResponse = async (
  supabase: SupabaseClient,
  input: InsertResumeTsxResponseInput,
): Promise<void> => {
  const { error } = await supabase.from('resume_tsx_code_generation_responses').insert({
    id: input.id,
    tsx_code: input.tsxCode,
    agent_summary: input.agentSummary,
  });

  if (error) {
    console.error('❌ insertResumeTsxResponse:', error.message);
    throw new Error(`Failed to insert response record: ${error.message}`);
  }
};
