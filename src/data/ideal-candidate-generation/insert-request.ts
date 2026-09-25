import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

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
 * @param pool - Supabase service-role client
 * @param input - Request fields
 */
export const insertIdealCandidateRequest = async (
  pool: Pool,
  input: InsertIdealCandidateRequestInput,
): Promise<void> => {
  try {
    await insertRow(pool, 'ideal_candidate_generation_requests', {
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
    console.error('❌ insertIdealCandidateRequest:', message);
    throw new Error(`Failed to insert ideal candidate request record: ${message}`);
  }
};
