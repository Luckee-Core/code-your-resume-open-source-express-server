import type { JobApplication } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { listJobApplicationsFromSupabase } from "./supabase/list-job-applications-from-supabase";

/**
 * Lists all job applications from Supabase CRM.
 */
export const listJobApplicationsFromStore = async (): Promise<JobApplication[]> => {
  return listJobApplicationsFromSupabase(requireCrmSupabaseClient());
};
