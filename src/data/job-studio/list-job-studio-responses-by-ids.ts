import type { Pool } from "pg";
import { selectRowsFrom } from "../../utils/postgres";

export type JobStudioResponseRow = {
  id: string;
  structured: Record<string, unknown>;
};

/**
 * Fetch Job Studio response rows by id list.
 */
export const listJobStudioResponsesByIds = async (
  pool: Pool,
  ids: string[],
): Promise<JobStudioResponseRow[]> => {
  if (ids.length === 0) return [];

  try {
    return await selectRowsFrom<JobStudioResponseRow>(pool, "job_studio_responses", {
      columns: "id, structured",
      in: { id: ids },
    });
  } catch (error) {
    console.error("❌ listJobStudioResponsesByIds:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
