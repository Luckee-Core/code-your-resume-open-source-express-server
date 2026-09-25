import type { Pool } from "pg";
import type { JobListingSectionRow } from "../job-responsibilities/types";
import { selectRowsFrom } from "../../utils/postgres";

type RequirementRow = {
  id: string;
  job_id: string;
  body: string;
  sort_order: number;
};

/**
 * Lists requirement rows for a job, ordered by sort_order.
 */
export const listJobRequirementsByJobId = async (
  pool: Pool,
  jobId: string,
): Promise<JobListingSectionRow[]> => {
  const rows = await selectRowsFrom<RequirementRow>(pool, "job_requirements", {
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
