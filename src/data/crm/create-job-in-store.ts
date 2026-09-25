import { randomUUID } from "node:crypto";
import type { Job, JobStatus, JobType } from "./types";
import { isJobStatus } from "./is-job-status";
import { requireCrmPgPool } from "./require-crm-pg-pool";
import { getJobFromSupabase } from "./supabase/get-job-from-supabase";
import { insertRow } from "../../utils/postgres";

/**
 * Inserts a new job row in Supabase CRM.
 */
export const createJobInStore = async (input: {
  companyId: string;
  type?: JobType;
  title: string;
  url: string;
  status: JobStatus;
}): Promise<Job> => {
  const pool = requireCrmPgPool();
  const id = randomUUID();
  const now = new Date().toISOString();
  const status = isJobStatus(input.status) ? input.status : "draft";

  await insertRow(pool, "jobs", {
    id,
    company_id: input.companyId,
    title: input.title.trim(),
    url: input.url.trim(),
    status,
    description: "",
    listing_imported_at: null,
    latest_scrape_run_id: null,
    latest_ai_exchange_id: null,
    created_at: now,
    updated_at: now,
  });

  const row = await getJobFromSupabase(pool, id);
  if (!row) {
    throw new Error("Failed to load job after insert");
  }
  return { ...row, type: input.type ?? "job" };
};
