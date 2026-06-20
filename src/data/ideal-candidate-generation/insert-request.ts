import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertIdealCandidateRequestInput = {
  id: string;
  jobId: string;
  skills: string[];
  canvasWidthPx: number;
  canvasHeightPx: number;
  promptText: string;
};

/**
 * Insert a new ideal candidate generation request record (status: pending).
 *
 * @param supabase - Supabase service-role client
 * @param input - Request fields
 */
export const insertIdealCandidateRequest = async (
  supabase: SupabaseClient,
  input: InsertIdealCandidateRequestInput,
): Promise<void> => {
  const { error } = await supabase.from('ideal_candidate_generation_requests').insert({
    id: input.id,
    job_id: input.jobId,
    skills: input.skills,
    canvas_width_px: input.canvasWidthPx,
    canvas_height_px: input.canvasHeightPx,
    prompt_text: input.promptText,
    status: 'pending',
  });

  if (error) {
    console.error('❌ insertIdealCandidateRequest:', error.message);
    throw new Error(`Failed to insert ideal candidate request record: ${error.message}`);
  }
};
