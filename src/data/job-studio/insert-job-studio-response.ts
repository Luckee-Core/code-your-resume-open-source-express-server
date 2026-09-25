import type { Pool } from "pg";
import { insertRow } from "../../utils/postgres";

/**
 * Persist parsed Job Studio coach payload (content, coachSections).
 */
export const insertJobStudioResponse = async (
  pool: Pool,
  id: string,
  structured: unknown,
): Promise<void> => {
  const now = new Date().toISOString();
  try {
    await insertRow(pool, "job_studio_responses", {
      id,
      structured,
      created_at: now,
      updated_at: now,
    });
  } catch (error) {
    console.error("❌ insertJobStudioResponse:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
