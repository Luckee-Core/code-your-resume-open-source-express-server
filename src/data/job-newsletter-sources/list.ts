import type { SupabaseClient } from "@supabase/supabase-js";
import type { JobNewsletterSource } from "./types";

/**
 * List all job newsletter sources, newest first.
 */
export const listJobNewsletterSources = async (
  supabase: SupabaseClient,
): Promise<JobNewsletterSource[]> => {
  const { data, error } = await supabase
    .from("job_newsletter_sources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ listJobNewsletterSources:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []) as JobNewsletterSource[];
};
