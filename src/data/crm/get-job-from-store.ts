import type { Job } from "./types";
import { requireCrmPgPool } from "./require-crm-pg-pool";
import { getJobFromSupabase } from "./supabase/get-job-from-supabase";

/**
 * Fetches one job by id from Supabase CRM.
 */
export const getJobFromStore = async (id: string): Promise<Job | null> => {
  return getJobFromSupabase(requireCrmPgPool(), id);
};
