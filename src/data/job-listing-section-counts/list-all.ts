import type { Pool } from "pg";
import { countRowsByJobId } from "./count-rows-by-job-id";
import type { JobListingSectionCountsRow } from "./types";
import { selectRowsFrom } from "../../utils/postgres";

type JobIdRow = {
  job_id: string;
};

/**
 * Returns responsibility / requirement / nice-to-have row counts per job (all jobs).
 */
export const listAllJobListingSectionCounts = async (
  pool: Pool
): Promise<JobListingSectionCountsRow[]> => {
  const [respRows, reqRows, nthRows] = await Promise.all([
    selectRowsFrom<JobIdRow>(pool, "job_responsibilities", { columns: "job_id" }),
    selectRowsFrom<JobIdRow>(pool, "job_requirements", { columns: "job_id" }),
    selectRowsFrom<JobIdRow>(pool, "job_nice_to_have", { columns: "job_id" }),
  ]);

  const respCounts = countRowsByJobId(respRows);
  const reqCounts = countRowsByJobId(reqRows);
  const nthCounts = countRowsByJobId(nthRows);

  const jobIds = new Set<string>([
    ...respCounts.keys(),
    ...reqCounts.keys(),
    ...nthCounts.keys(),
  ]);

  return [...jobIds].map((jobId) => ({
    jobId,
    responsibilitiesCount: respCounts.get(jobId) ?? 0,
    requirementsCount: reqCounts.get(jobId) ?? 0,
    niceToHavesCount: nthCounts.get(jobId) ?? 0,
  }));
};
