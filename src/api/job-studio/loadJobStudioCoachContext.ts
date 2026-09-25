import type { Pool } from "pg";
import type { Job } from "../../data/crm/types";
import { listSectionBodiesByJobId } from "../../data/job-listing-sections";

export type JobStudioCoachContext = {
  jobTitle: string;
  companyName: string | null;
  postingUrl: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves: string[];
};

/**
 * Assemble CRM + Postgres bullet text for the Job Studio coach prompt.
 */
export const loadJobStudioCoachContext = async (
  pool: Pool | null,
  job: Job,
  companyName: string | null,
): Promise<JobStudioCoachContext> => {
  const jobId = job.id;
  const [respBodies, reqBodies, nthBodies] = pool
    ? await Promise.all([
        listSectionBodiesByJobId(pool, jobId, "job_responsibilities"),
        listSectionBodiesByJobId(pool, jobId, "job_requirements"),
        listSectionBodiesByJobId(pool, jobId, "job_nice_to_have"),
      ])
    : [[], [], []];

  const responsibilities = respBodies.length ? respBodies : job.responsibilities ?? [];
  const requirements = reqBodies.length ? reqBodies : job.requirements ?? [];
  const niceToHaves = nthBodies.length ? nthBodies : job.niceToHaves ?? [];

  return {
    jobTitle: job.title.trim() || "Untitled role",
    companyName,
    postingUrl: job.url.trim(),
    description: job.description.trim(),
    responsibilities,
    requirements,
    niceToHaves,
  };
};
