import type { Pool } from "pg";
import { scrapeRunIdOrNull } from "../job-listing/scrape-run-id-or-null";
import type { JobListingAiRequest } from "../job-listing/types";
import { insertRow } from "../../utils/postgres";

/**
 * Inserts one `job_listing_ai_requests` row.
 */
export const insertJobListingAiRequest = async (
  pool: Pool,
  row: JobListingAiRequest,
): Promise<void> => {
  await insertRow(pool, "job_listing_ai_requests", {
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
  console.log("💾 insertJobListingAiRequest", { id: row.id, jobId: row.jobId });
};
