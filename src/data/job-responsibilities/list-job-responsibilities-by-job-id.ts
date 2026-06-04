import type { SupabaseClient } from "@supabase/supabase-js";
import type { JobListingSectionRow } from "./types";

/**
 * Lists responsibility rows for a job, ordered by sort_order.
 */
export const listJobResponsibilitiesByJobId = async (
  supabase: SupabaseClient,
  jobId: string,
): Promise<JobListingSectionRow[]> => {
  const { data, error } = await supabase
    .from("job_responsibilities")
    .select("id, job_id, body, sort_order")
    .eq("job_id", jobId)
    .order("sort_order");

  if (error) {
    console.error("❌ listJobResponsibilitiesByJobId:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map((r) => ({
    id: r.id,
    jobId: r.job_id,
    body: r.body,
    sortOrder: r.sort_order,
  }));
};
