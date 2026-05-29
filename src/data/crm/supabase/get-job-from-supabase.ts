import type { SupabaseClient } from "@supabase/supabase-js";
import type { Job } from "../types";
import { mapJobRow } from "./map-job-row";

/**
 * Loads one job by id from Supabase.
 */
export const getJobFromSupabase = async (supabase: SupabaseClient, id: string): Promise<Job | null> => {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id, company_id, title, url, status, description, listing_imported_at, latest_scrape_run_id, latest_ai_exchange_id, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("❌ getJobFromSupabase:", error.message);
    throw new Error(error.message);
  }

  return data ? mapJobRow(data) : null;
};
