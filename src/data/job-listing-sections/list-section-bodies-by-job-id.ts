import type { SupabaseClient } from "@supabase/supabase-js";

export type JobListingSectionTable =
  | "job_responsibilities"
  | "job_requirements"
  | "job_nice_to_have";

/**
 * Returns ordered bullet bodies for a job listing section table.
 */
export const listSectionBodiesByJobId = async (
  supabase: SupabaseClient,
  jobId: string,
  table: JobListingSectionTable,
): Promise<string[]> => {
  const { data, error } = await supabase.from(table).select("body").eq("job_id", jobId).order("sort_order");
  if (error) {
    console.warn(`⚠️ listSectionBodiesByJobId ${table}:`, error.message);
    return [];
  }
  return (data ?? []).map((r: { body: string }) => r.body).filter(Boolean);
};
