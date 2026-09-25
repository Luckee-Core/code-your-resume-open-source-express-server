import type { Pool } from "pg";
import type { JobListingSectionRow } from "../job-responsibilities/types";
import { selectRowsFrom } from "../../utils/postgres";

type NiceToHaveRow = {
  id: string;
  job_id: string;
  body: string;
  sort_order: number;
};

/**
 * Lists nice-to-have rows for a job, ordered by sort_order.
 */
export const listJobNiceToHavesByJobId = async (
  pool: Pool,
  jobId: string,
): Promise<JobListingSectionRow[]> => {
  const rows = await selectRowsFrom<NiceToHaveRow>(pool, "job_nice_to_have", {
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
