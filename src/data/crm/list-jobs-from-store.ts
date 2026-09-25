import type { Job } from "./types";
import { requireCrmPgPool } from "./require-crm-pg-pool";
import { listJobsFromSupabase } from "./supabase/list-jobs-from-supabase";

/**
 * Lists all jobs from Supabase CRM.
 */
export const listJobsFromStore = async (): Promise<Job[]> => {
  return listJobsFromSupabase(requireCrmPgPool());
};
