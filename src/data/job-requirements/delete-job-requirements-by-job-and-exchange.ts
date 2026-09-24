import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Deletes `job_requirements` rows for one job + listing AI exchange. Logs PostgREST errors without throwing.
 */
export const deleteJobRequirementsByJobAndExchange = async (
  supabase: SupabaseClient,
  jobId: string,
  exchangeId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("job_requirements")
    .delete()
    .eq("job_id", jobId)
    .eq("exchange_id", exchangeId);
  if (error) {
    console.error("❌ deleteJobRequirementsByJobAndExchange", error.message, error);
  }
};
