import type { Pool } from "pg";
import { scrapeRunIdOrNull } from "../job-listing/scrape-run-id-or-null";
import type { JobListingAiExchange } from "../job-listing/types";
import { insertRow } from "../../utils/postgres";

/**
 * Inserts one `job_listing_ai_exchanges` row.
 */
export const insertJobListingAiExchange = async (
  pool: Pool,
  row: JobListingAiExchange,
): Promise<void> => {
  await insertRow(pool, "job_listing_ai_exchanges", {
    id: row.id,
    job_id: row.jobId,
    scrape_run_id: scrapeRunIdOrNull(row.scrapeRunId),
    request_id: row.requestId,
    response_id: row.responseId,
    created_at: row.createdAt,
  });
  console.log("💾 insertJobListingAiExchange", { id: row.id, jobId: row.jobId });
};
