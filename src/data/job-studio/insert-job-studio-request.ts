import type { Pool } from "pg";
import { insertRow } from "../../utils/postgres";

/**
 * Create a pending Job Studio chat request (user message).
 */
export const insertJobStudioRequest = async (
  pool: Pool,
  params: {
    id: string;
    jobId: string;
    userId: string;
    content: string;
  },
): Promise<void> => {
  const now = new Date().toISOString();
  try {
    await insertRow(pool, "job_studio_requests", {
      id: params.id,
      job_id: params.jobId,
      user_id: params.userId,
      content: params.content,
      status: "pending",
      created_at: now,
      updated_at: now,
    });
  } catch (error) {
    console.error("❌ insertJobStudioRequest:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
