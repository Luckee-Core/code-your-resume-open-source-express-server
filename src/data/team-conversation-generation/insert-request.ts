import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

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
 * @param pool - Supabase service-role client
 * @param input - Request fields
 */
export const insertTeamConversationRequest = async (
  pool: Pool,
  input: InsertTeamConversationRequestInput,
): Promise<void> => {
  try {
    await insertRow(pool, 'team_conversation_generation_requests', {
      id: input.id,
      job_id: input.jobId,
      skills: input.skills,
      canvas_width_px: input.canvasWidthPx,
      canvas_height_px: input.canvasHeightPx,
      prompt_text: input.promptText,
      status: 'pending',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ insertTeamConversationRequest:', message);
    throw new Error(`Failed to insert team conversation request record: ${message}`);
  }
};
