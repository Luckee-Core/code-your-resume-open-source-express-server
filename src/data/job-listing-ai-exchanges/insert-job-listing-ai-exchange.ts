import type { SupabaseClient } from "@supabase/supabase-js";
import { scrapeRunIdOrNull } from "../job-listing/scrape-run-id-or-null";
import type { JobListingAiExchange } from "../job-listing/types";

/**
 * Inserts one `job_listing_ai_exchanges` row. Throws on PostgREST error.
 */
export const insertJobListingAiExchange = async (
  supabase: SupabaseClient,
  row: JobListingAiExchange,
): Promise<void> => {
  const { error } = await supabase.from("job_listing_ai_exchanges").insert({
    id: row.id,
    job_id: row.jobId,
    scrape_run_id: scrapeRunIdOrNull(row.scrapeRunId),
    request_id: row.requestId,
    response_id: row.responseId,
    created_at: row.createdAt,
  });
  if (error) {
    console.error("❌ insertJobListingAiExchange", error.message, error);
    throw new Error(`job_listing_ai_exchanges insert failed: ${error.message}`);
  }
  console.log("💾 insertJobListingAiExchange", { id: row.id, jobId: row.jobId });
};
