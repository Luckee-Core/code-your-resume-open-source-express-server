import type { Pool } from "pg";
import { selectRowsFrom } from "../../utils/postgres";

export type JobListingSectionTable =
  | "job_responsibilities"
  | "job_requirements"
  | "job_nice_to_have";

type SectionBodyRow = {
  body: string;
};

/**
 * Returns ordered bullet bodies for a job listing section table.
 */
export const listSectionBodiesByJobId = async (
  pool: Pool,
  jobId: string,
  table: JobListingSectionTable,
): Promise<string[]> => {
  const rows = await selectRowsFrom<SectionBodyRow>(pool, table, {
    columns: "body",
    eq: { job_id: jobId },
    order: [{ column: "sort_order" }],
  });
  return rows.map((r) => r.body).filter(Boolean);
};
