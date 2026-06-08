import type { SupabaseClient } from "@supabase/supabase-js";
import type { JobNewsletterSource } from "./types";

/**
 * Get a job newsletter source by id.
 */
export const getJobNewsletterSourceById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<JobNewsletterSource | null> => {
  const { data, error } = await supabase
    .from("job_newsletter_sources")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("❌ getJobNewsletterSourceById:", error.message);
    throw new Error(error.message);
  }

  return data as JobNewsletterSource | null;
};
