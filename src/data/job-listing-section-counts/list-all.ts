import type { SupabaseClient } from "@supabase/supabase-js";
import { countRowsByJobId } from "./count-rows-by-job-id";
import type { JobListingSectionCountsRow } from "./types";

/**
 * Returns responsibility / requirement / nice-to-have row counts per job (all jobs).
 */
export const listAllJobListingSectionCounts = async (
  supabase: SupabaseClient
): Promise<JobListingSectionCountsRow[]> => {
  const [respResult, reqResult, nthResult] = await Promise.all([
    supabase.from("job_responsibilities").select("job_id"),
    supabase.from("job_requirements").select("job_id"),
    supabase.from("job_nice_to_have").select("job_id"),
  ]);

  if (respResult.error) {
    console.error("❌ listAllJobListingSectionCounts responsibilities:", respResult.error.message);
    throw new Error(respResult.error.message);
  }
  if (reqResult.error) {
    console.error("❌ listAllJobListingSectionCounts requirements:", reqResult.error.message);
    throw new Error(reqResult.error.message);
  }
  if (nthResult.error) {
    console.error("❌ listAllJobListingSectionCounts nice_to_have:", nthResult.error.message);
    throw new Error(nthResult.error.message);
  }

  const respCounts = countRowsByJobId(respResult.data ?? []);
  const reqCounts = countRowsByJobId(reqResult.data ?? []);
  const nthCounts = countRowsByJobId(nthResult.data ?? []);

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
