import type { Pool } from "pg";
import type { Job } from "../types";
import { mapJobRow, type JobRow } from "./map-job-row";
import { selectOneFrom } from "../../../utils/postgres";

/**
 * Loads one job by id from Supabase.
 */
export const getJobFromSupabase = async (pool: Pool, id: string): Promise<Job | null> => {
  const data = await selectOneFrom<JobRow>(pool, "jobs", {
    columns:
      "id, company_id, title, url, status, description, listing_imported_at, latest_scrape_run_id, latest_ai_exchange_id, created_at, updated_at",
    eq: { id },
  });

  return data ? mapJobRow(data) : null;
};
