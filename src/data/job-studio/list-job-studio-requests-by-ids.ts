import { SupabaseClient } from "@supabase/supabase-js";

export type JobStudioRequestRow = {
  id: string;
  job_id: string;
  user_id: string;
  content: string;
  status: string;
  created_at: string;
};

/**
 * Fetch Job Studio request rows by id list.
 */
export const listJobStudioRequestsByIds = async (
  supabase: SupabaseClient,
  ids: string[],
): Promise<JobStudioRequestRow[]> => {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("job_studio_requests")
    .select("id, job_id, user_id, content, status, created_at")
    .in("id", ids);

  if (error) {
    console.error("❌ listJobStudioRequestsByIds:", error);
    throw new Error(error.message);
  }

  return (data ?? []) as JobStudioRequestRow[];
};
