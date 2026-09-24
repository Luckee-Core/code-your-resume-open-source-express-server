import type { SupabaseClient } from "@supabase/supabase-js";
import { mapStructuredBulletToRow } from "../job-listing-sections/map-structured-bullet-to-row";
import type { JobListingStructuredBulletRow } from "../job-listing/types";

/**
 * Inserts `job_requirements` rows. Logs PostgREST errors without throwing.
 */
export const insertJobRequirements = async (
  supabase: SupabaseClient,
  rows: JobListingStructuredBulletRow[],
): Promise<void> => {
  if (rows.length === 0) {
    return;
  }
  const { error } = await supabase.from("job_requirements").insert(rows.map(mapStructuredBulletToRow));
  if (error) {
    console.error("❌ insertJobRequirements", error.message, error);
  }
};
