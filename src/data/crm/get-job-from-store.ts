import type { Job } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getJobFromSupabase } from "./supabase/get-job-from-supabase";

/**
 * Fetches one job by id from Supabase CRM.
 */
export const getJobFromStore = async (id: string): Promise<Job | null> => {
  return getJobFromSupabase(requireCrmSupabaseClient(), id);
};
