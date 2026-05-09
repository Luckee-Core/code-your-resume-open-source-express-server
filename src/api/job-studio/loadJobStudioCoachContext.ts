import { SupabaseClient } from "@supabase/supabase-js";
import type { Job, JobApplication } from "../../data/crm/types";

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

const bulletBodies = async (
  supabase: SupabaseClient | null,
  jobId: string,
  table: string,
): Promise<string[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from(table).select("body").eq("job_id", jobId).order("sort_order");
  if (error) {
    console.warn(`⚠️ loadJobStudioCoachContext ${table}:`, error.message);
    return [];
  }
  return (data ?? []).map((r: { body: string }) => r.body).filter(Boolean);
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
  const [respBodies, reqBodies, nthBodies] = await Promise.all([
    bulletBodies(supabase, jobId, "job_responsibilities"),
    bulletBodies(supabase, jobId, "job_requirements"),
    bulletBodies(supabase, jobId, "job_nice_to_have"),
  ]);

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
