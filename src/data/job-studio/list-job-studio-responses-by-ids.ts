import { SupabaseClient } from "@supabase/supabase-js";

export type JobStudioResponseRow = {
  id: string;
  structured: Record<string, unknown>;
};

/**
 * Fetch Job Studio response rows by id list.
 */
export const listJobStudioResponsesByIds = async (
  supabase: SupabaseClient,
  ids: string[],
): Promise<JobStudioResponseRow[]> => {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("job_studio_responses")
    .select("id, structured")
    .in("id", ids);

  if (error) {
    console.error("❌ listJobStudioResponsesByIds:", error);
    throw new Error(error.message);
  }

  return (data ?? []) as JobStudioResponseRow[];
};
