import type { Pool } from "pg";
import { selectRowsFrom } from "../../utils/postgres";

export type JobStudioExchangeRow = {
  id: string;
  job_id: string;
  request_id: string;
  response_id: string | null;
  created_at: string;
};

/**
 * List Job Studio exchanges for one job, oldest first (chat order).
 */
export const listJobStudioExchangesByJobId = async (
  pool: Pool,
  jobId: string,
): Promise<JobStudioExchangeRow[]> => {
  try {
    return await selectRowsFrom<JobStudioExchangeRow>(pool, "job_studio_exchanges", {
      columns: "id, job_id, request_id, response_id, created_at",
      eq: { job_id: jobId },
      order: [{ column: "created_at", ascending: true }],
    });
  } catch (error) {
    console.error("❌ listJobStudioExchangesByJobId:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
