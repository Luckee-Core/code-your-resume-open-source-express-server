import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertTeamConversationRequestInput = {
  id: string;
  jobId: string;
  skills: string[];
  canvasWidthPx: number;
  canvasHeightPx: number;
  promptText: string;
};

/**
 * Insert a new team conversation generation request record (status: pending).
 *
 * @param supabase - Supabase service-role client
 * @param input - Request fields
 */
export const insertTeamConversationRequest = async (
  supabase: SupabaseClient,
  input: InsertTeamConversationRequestInput,
): Promise<void> => {
  const { error } = await supabase.from('team_conversation_generation_requests').insert({
    id: input.id,
    job_id: input.jobId,
    skills: input.skills,
    canvas_width_px: input.canvasWidthPx,
    canvas_height_px: input.canvasHeightPx,
    prompt_text: input.promptText,
    status: 'pending',
  });

  if (error) {
    console.error('❌ insertTeamConversationRequest:', error.message);
    throw new Error(`Failed to insert team conversation request record: ${error.message}`);
  }
};
