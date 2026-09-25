import type { Pool } from "pg";
import type { Job } from "../types";
import { mapJobRow, type JobRow } from "./map-job-row";
import { selectRowsFrom } from "../../../utils/postgres";

/**
 * Lists all jobs from Supabase `jobs` (newest `updated_at` first).
 */
export const listJobsFromSupabase = async (pool: Pool): Promise<Job[]> => {
  const rows = await selectRowsFrom<JobRow>(pool, "jobs", {
    columns:
      "id, company_id, title, url, status, description, listing_imported_at, latest_scrape_run_id, latest_ai_exchange_id, created_at, updated_at",
    order: [{ column: "updated_at", ascending: false }],
  });

  return rows.map((row) => mapJobRow(row));
};
