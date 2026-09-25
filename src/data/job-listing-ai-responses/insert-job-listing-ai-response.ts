import type { Pool } from "pg";
import type { JobListingAiResponse } from "../job-listing/types";
import { insertRow } from "../../utils/postgres";

/**
 * Inserts one `job_listing_ai_responses` row.
 */
export const insertJobListingAiResponse = async (
  pool: Pool,
  row: JobListingAiResponse,
): Promise<void> => {
  await insertRow(pool, "job_listing_ai_responses", {
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
  console.log("💾 insertJobListingAiResponse", { id: row.id, requestId: row.requestId });
};
