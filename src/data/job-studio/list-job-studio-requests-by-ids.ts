import type { Pool } from "pg";
import { selectRowsFrom } from "../../utils/postgres";

export type JobStudioRequestRow = {
  id: string;
  job_id: string;
  user_id: string;
  content: string;
  status: string;
  created_at: string;
};

/**
 * Fetch Job Studio request rows by id list.
 */
export const listJobStudioRequestsByIds = async (
  pool: Pool,
  ids: string[],
): Promise<JobStudioRequestRow[]> => {
  if (ids.length === 0) return [];

  try {
    return await selectRowsFrom<JobStudioRequestRow>(pool, "job_studio_requests", {
      columns: "id, job_id, user_id, content, status, created_at",
      in: { id: ids },
    });
  } catch (error) {
    console.error("❌ listJobStudioRequestsByIds:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
