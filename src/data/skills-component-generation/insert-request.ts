import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertSkillsComponentRequestInput = {
  id: string;
  jobId: string;
  skills: string[];
  canvasWidthPx: number;
  canvasHeightPx: number;
  promptText: string;
};

/**
 * Insert a new skills component generation request record (status: pending).
 *
 * @param supabase - Supabase service-role client
 * @param input - Request fields
 */
export const insertSkillsComponentRequest = async (
  supabase: SupabaseClient,
  input: InsertSkillsComponentRequestInput,
): Promise<void> => {
  const { error } = await supabase.from('skills_component_generation_requests').insert({
    id: input.id,
    job_id: input.jobId,
    skills: input.skills,
    canvas_width_px: input.canvasWidthPx,
    canvas_height_px: input.canvasHeightPx,
    prompt_text: input.promptText,
    status: 'pending',
  });

  if (error) {
    console.error('❌ insertSkillsComponentRequest:', error.message);
    throw new Error(`Failed to insert skills component request record: ${error.message}`);
  }
};
