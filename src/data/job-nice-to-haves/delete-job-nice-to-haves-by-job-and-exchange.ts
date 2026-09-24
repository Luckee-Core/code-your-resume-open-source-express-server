import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Deletes `job_nice_to_have` rows for one job + listing AI exchange. Logs PostgREST errors without throwing.
 */
export const deleteJobNiceToHavesByJobAndExchange = async (
  supabase: SupabaseClient,
  jobId: string,
  exchangeId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("job_nice_to_have")
    .delete()
    .eq("job_id", jobId)
    .eq("exchange_id", exchangeId);
  if (error) {
    console.error("❌ deleteJobNiceToHavesByJobAndExchange", error.message, error);
  }
};
