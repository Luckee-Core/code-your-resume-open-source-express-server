import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

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
 * @param pool - Supabase service-role client
 * @param input - Request fields
 */
export const insertCompanyInterestRequest = async (
  pool: Pool,
  input: InsertCompanyInterestRequestInput,
): Promise<void> => {
  try {
    await insertRow(pool, 'company_interest_generation_requests', {
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
    console.error('❌ insertCompanyInterestRequest:', message);
    throw new Error(`Failed to insert company interest request record: ${message}`);
  }
};
