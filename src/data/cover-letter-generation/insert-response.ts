import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertCoverLetterResponseInput = {
  id: string;
  tsxCode: string;
  agentSummary: string | null;
};

/**
 * Insert a cover letter generation response record containing extracted TSX.
 *
 * @param supabase - Supabase service-role client
 * @param input - Response fields
 */
export const insertCoverLetterResponse = async (
  supabase: SupabaseClient,
  input: InsertCoverLetterResponseInput,
): Promise<void> => {
  const { error } = await supabase.from('cover_letter_generation_responses').insert({
    id: input.id,
    tsx_code: input.tsxCode,
    agent_summary: input.agentSummary,
  });

  if (error) {
    console.error('❌ insertCoverLetterResponse:', error.message);
    throw new Error(`Failed to insert cover letter response record: ${error.message}`);
  }
};
