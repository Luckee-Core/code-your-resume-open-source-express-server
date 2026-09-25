import type { Pool } from "pg";
import type { JobListingSectionRow } from "./types";
import { selectRowsFrom } from "../../utils/postgres";

type ResponsibilityRow = {
  id: string;
  job_id: string;
  body: string;
  sort_order: number;
};

/**
 * Lists responsibility rows for a job, ordered by sort_order.
 */
export const listJobResponsibilitiesByJobId = async (
  pool: Pool,
  jobId: string,
): Promise<JobListingSectionRow[]> => {
  const rows = await selectRowsFrom<ResponsibilityRow>(pool, "job_responsibilities", {
    columns: "id, job_id, body, sort_order",
    eq: { job_id: jobId },
    order: [{ column: "sort_order" }],
  });

  return rows.map((r) => ({
    id: r.id,
    jobId: r.job_id,
    body: r.body,
    sortOrder: r.sort_order,
  }));
};
