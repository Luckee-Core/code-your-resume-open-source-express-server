import type { SupabaseClient } from "@supabase/supabase-js";
import type { Job, JobApplication } from "../../data/crm/types";
import { listSectionBodiesByJobId } from "../../data/job-listing-sections";

export type JobStudioCoachContext = {
  jobTitle: string;
  companyName: string | null;
  postingUrl: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves: string[];
  applicationsSummary: string;
};

/**
 * Assemble CRM + Supabase bullet text for the Job Studio coach prompt.
 */
export const loadJobStudioCoachContext = async (
  supabase: SupabaseClient | null,
  job: Job,
  companyName: string | null,
  applications: JobApplication[],
): Promise<JobStudioCoachContext> => {
  const jobId = job.id;
  const [respBodies, reqBodies, nthBodies] = supabase
    ? await Promise.all([
        listSectionBodiesByJobId(supabase, jobId, "job_responsibilities"),
        listSectionBodiesByJobId(supabase, jobId, "job_requirements"),
        listSectionBodiesByJobId(supabase, jobId, "job_nice_to_have"),
      ])
    : [[], [], []];

  const responsibilities = respBodies.length ? respBodies : job.responsibilities ?? [];
  const requirements = reqBodies.length ? reqBodies : job.requirements ?? [];
  const niceToHaves = nthBodies.length ? nthBodies : job.niceToHaves ?? [];

  const appsForJob = applications.filter((a) => a.jobId === jobId);
  const applicationsSummary =
    appsForJob.length === 0
      ? "No applications logged yet for this job."
      : appsForJob
          .map(
            (a, i) =>
              `${i + 1}. submittedAt=${a.submittedAt}, graphicId=${a.imageGraphicId}, notes=${a.notes || "(none)"}`,
          )
          .join("\n");

  return {
    jobTitle: job.title.trim() || "Untitled role",
    companyName,
    postingUrl: job.url.trim(),
    description: job.description.trim(),
    responsibilities,
    requirements,
    niceToHaves,
    applicationsSummary,
  };
};
