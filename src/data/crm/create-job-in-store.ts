import { randomUUID } from "node:crypto";
import type { Job, JobStatus, JobType } from "./types";
import { isJobStatus } from "./is-job-status";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getJobFromSupabase } from "./supabase/get-job-from-supabase";

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
  const supabase = requireCrmSupabaseClient();
  const id = randomUUID();
  const now = new Date().toISOString();
  const status = isJobStatus(input.status) ? input.status : "draft";

  const { error } = await supabase.from("jobs").insert({
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

  if (error) {
    console.error("❌ createJobInStore:", error.message);
    throw new Error(error.message);
  }

  const row = await getJobFromSupabase(supabase, id);
  if (!row) {
    throw new Error("Failed to load job after insert");
  }
  return { ...row, type: input.type ?? "job" };
};
