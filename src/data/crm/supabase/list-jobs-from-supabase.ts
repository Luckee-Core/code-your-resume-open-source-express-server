import type { SupabaseClient } from "@supabase/supabase-js";
import type { Job } from "../types";
import { mapJobRow } from "./map-job-row";

/**
 * Lists all jobs from Supabase `jobs` (newest `updated_at` first).
 */
export const listJobsFromSupabase = async (supabase: SupabaseClient): Promise<Job[]> => {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id, company_id, title, url, status, description, listing_imported_at, latest_scrape_run_id, latest_ai_exchange_id, created_at, updated_at",
    )
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("❌ listJobsFromSupabase:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapJobRow(row));
};
