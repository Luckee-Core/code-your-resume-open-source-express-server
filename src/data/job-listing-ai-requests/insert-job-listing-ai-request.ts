import type { SupabaseClient } from "@supabase/supabase-js";
import { scrapeRunIdOrNull } from "../job-listing/scrape-run-id-or-null";
import type { JobListingAiRequest } from "../job-listing/types";

/**
 * Inserts one `job_listing_ai_requests` row. Throws on PostgREST error.
 */
export const insertJobListingAiRequest = async (
  supabase: SupabaseClient,
  row: JobListingAiRequest,
): Promise<void> => {
  const { error } = await supabase.from("job_listing_ai_requests").insert({
    id: row.id,
    job_id: row.jobId,
    scrape_run_id: scrapeRunIdOrNull(row.scrapeRunId),
    provider: row.provider,
    model: row.model,
    system_prompt: row.systemPrompt,
    user_message: row.userMessage,
    request_payload_json: row.requestPayloadJson,
    created_at: row.createdAt,
  });
  if (error) {
    console.error("❌ insertJobListingAiRequest", error.message, error);
    throw new Error(`job_listing_ai_requests insert failed: ${error.message}`);
  }
  console.log("💾 insertJobListingAiRequest", { id: row.id, jobId: row.jobId });
};
