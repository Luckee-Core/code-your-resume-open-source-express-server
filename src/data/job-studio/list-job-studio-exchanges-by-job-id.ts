import { SupabaseClient } from "@supabase/supabase-js";

export type JobStudioExchangeRow = {
  id: string;
  job_id: string;
  request_id: string;
  response_id: string | null;
  created_at: string;
};

/**
 * List Job Studio exchanges for one job, oldest first (chat order).
 */
export const listJobStudioExchangesByJobId = async (
  supabase: SupabaseClient,
  jobId: string,
): Promise<JobStudioExchangeRow[]> => {
  const { data, error } = await supabase
    .from("job_studio_exchanges")
    .select("id, job_id, request_id, response_id, created_at")
    .eq("job_id", jobId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("❌ listJobStudioExchangesByJobId:", error);
    throw new Error(error.message);
  }

  return (data ?? []) as JobStudioExchangeRow[];
};
