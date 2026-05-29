import type { SupabaseClient } from "@supabase/supabase-js";
import type { JobApplication } from "../types";
import { mapJobApplicationRow } from "./map-job-application-row";

/**
 * Loads one job application by id from Supabase.
 */
export const getJobApplicationFromSupabase = async (
  supabase: SupabaseClient,
  id: string,
): Promise<JobApplication | null> => {
  const { data, error } = await supabase
    .from("job_applications")
    .select("id, job_id, submitted_at, image_graphic_id, notes, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("❌ getJobApplicationFromSupabase:", error.message);
    throw new Error(error.message);
  }

  return data ? mapJobApplicationRow(data) : null;
};
