import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertCoverLetterRequestInput = {
  id: string;
  jobId: string;
  skills: string[];
  canvasWidthPx: number;
  canvasHeightPx: number;
  promptText: string;
};

/**
 * Insert a new cover letter generation request record (status: pending).
 *
 * @param supabase - Supabase service-role client
 * @param input - Request fields
 */
export const insertCoverLetterRequest = async (
  supabase: SupabaseClient,
  input: InsertCoverLetterRequestInput,
): Promise<void> => {
  const { error } = await supabase.from('cover_letter_generation_requests').insert({
    id: input.id,
    job_id: input.jobId,
    skills: input.skills,
    canvas_width_px: input.canvasWidthPx,
    canvas_height_px: input.canvasHeightPx,
    prompt_text: input.promptText,
    status: 'pending',
  });

  if (error) {
    console.error('❌ insertCoverLetterRequest:', error.message);
    throw new Error(`Failed to insert cover letter request record: ${error.message}`);
  }
};
