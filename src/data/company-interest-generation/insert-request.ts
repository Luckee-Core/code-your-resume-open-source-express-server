import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertCompanyInterestRequestInput = {
  id: string;
  jobId: string;
  skills: string[];
  canvasWidthPx: number;
  canvasHeightPx: number;
  promptText: string;
};

/**
 * Insert a new company interest generation request record (status: pending).
 *
 * @param supabase - Supabase service-role client
 * @param input - Request fields
 */
export const insertCompanyInterestRequest = async (
  supabase: SupabaseClient,
  input: InsertCompanyInterestRequestInput,
): Promise<void> => {
  const { error } = await supabase.from('company_interest_generation_requests').insert({
    id: input.id,
    job_id: input.jobId,
    skills: input.skills,
    canvas_width_px: input.canvasWidthPx,
    canvas_height_px: input.canvasHeightPx,
    prompt_text: input.promptText,
    status: 'pending',
  });

  if (error) {
    console.error('❌ insertCompanyInterestRequest:', error.message);
    throw new Error(`Failed to insert company interest request record: ${error.message}`);
  }
};
