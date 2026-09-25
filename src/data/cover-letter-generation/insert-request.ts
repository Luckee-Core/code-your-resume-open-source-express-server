import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

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
 * @param pool - Supabase service-role client
 * @param input - Request fields
 */
export const insertCoverLetterRequest = async (
  pool: Pool,
  input: InsertCoverLetterRequestInput,
): Promise<void> => {
  try {
    await insertRow(pool, 'cover_letter_generation_requests', {
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
    console.error('❌ insertCoverLetterRequest:', message);
    throw new Error(`Failed to insert cover letter request record: ${message}`);
  }
};
