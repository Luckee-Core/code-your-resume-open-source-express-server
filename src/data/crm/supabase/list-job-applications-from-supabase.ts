import type { SupabaseClient } from "@supabase/supabase-js";
import type { JobApplication } from "../types";
import { mapJobApplicationRow } from "./map-job-application-row";

/**
 * Lists all job applications from Supabase `job_applications`.
 */
export const listJobApplicationsFromSupabase = async (
  supabase: SupabaseClient,
): Promise<JobApplication[]> => {
  const { data, error } = await supabase
    .from("job_applications")
    .select("id, job_id, submitted_at, image_graphic_id, notes, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("❌ listJobApplicationsFromSupabase:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapJobApplicationRow(row));
};
