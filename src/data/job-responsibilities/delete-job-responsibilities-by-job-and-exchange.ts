import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Deletes `job_responsibilities` rows for one job + listing AI exchange. Logs PostgREST errors without throwing.
 */
export const deleteJobResponsibilitiesByJobAndExchange = async (
  supabase: SupabaseClient,
  jobId: string,
  exchangeId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("job_responsibilities")
    .delete()
    .eq("job_id", jobId)
    .eq("exchange_id", exchangeId);
  if (error) {
    console.error("❌ deleteJobResponsibilitiesByJobAndExchange", error.message, error);
  }
};
