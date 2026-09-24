import type { SupabaseClient } from "@supabase/supabase-js";
import type { JobListingAiResponse } from "../job-listing/types";

/**
 * Inserts one `job_listing_ai_responses` row. Throws on PostgREST error.
 */
export const insertJobListingAiResponse = async (
  supabase: SupabaseClient,
  row: JobListingAiResponse,
): Promise<void> => {
  const { error } = await supabase.from("job_listing_ai_responses").insert({
    id: row.id,
    request_id: row.requestId,
    model: row.model,
    status: row.status,
    raw_response: row.rawResponse,
    parsed_response_json: row.parsedResponseJson,
    error_message: row.errorMessage,
    usage_input_tokens: row.usageInputTokens,
    usage_output_tokens: row.usageOutputTokens,
    created_at: row.createdAt,
  });
  if (error) {
    console.error("❌ insertJobListingAiResponse", error.message, error);
    throw new Error(`job_listing_ai_responses insert failed: ${error.message}`);
  }
  console.log("💾 insertJobListingAiResponse", { id: row.id, requestId: row.requestId });
};
