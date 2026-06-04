import type { Job } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { listJobsFromSupabase } from "./supabase/list-jobs-from-supabase";

/**
 * Lists all jobs from Supabase CRM.
 */
export const listJobsFromStore = async (): Promise<Job[]> => {
  return listJobsFromSupabase(requireCrmSupabaseClient());
};
