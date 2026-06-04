import type { JobApplication } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getJobApplicationFromSupabase } from "./supabase/get-job-application-from-supabase";

/**
 * Fetches one job application by id from Supabase CRM.
 */
export const getJobApplicationFromStore = async (id: string): Promise<JobApplication | null> => {
  return getJobApplicationFromSupabase(requireCrmSupabaseClient(), id);
};
