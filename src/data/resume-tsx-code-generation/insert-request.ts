import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertResumeTsxRequestInput = {
  id: string;
  skills: string[];
  canvasWidthPx: number;
  canvasHeightPx: number;
  promptText: string;
};

/**
 * Insert a new resume TSX code generation request record (status: pending).
 *
 * @param supabase - Supabase service-role client
 * @param input - Request fields
 */
export const insertResumeTsxRequest = async (
  supabase: SupabaseClient,
  input: InsertResumeTsxRequestInput,
): Promise<void> => {
  const { error } = await supabase.from('resume_tsx_code_generation_requests').insert({
    id: input.id,
    skills: input.skills,
    canvas_width_px: input.canvasWidthPx,
    canvas_height_px: input.canvasHeightPx,
    prompt_text: input.promptText,
    status: 'pending',
  });

  if (error) {
    console.error('❌ insertResumeTsxRequest:', error.message);
    throw new Error(`Failed to insert request record: ${error.message}`);
  }
};
