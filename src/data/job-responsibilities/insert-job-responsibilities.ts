import type { SupabaseClient } from "@supabase/supabase-js";
import { mapStructuredBulletToRow } from "../job-listing-sections/map-structured-bullet-to-row";
import type { JobListingStructuredBulletRow } from "../job-listing/types";

/**
 * Inserts `job_responsibilities` rows. Logs PostgREST errors without throwing.
 */
export const insertJobResponsibilities = async (
  supabase: SupabaseClient,
  rows: JobListingStructuredBulletRow[],
): Promise<void> => {
  if (rows.length === 0) {
    return;
  }
  const { error } = await supabase.from("job_responsibilities").insert(rows.map(mapStructuredBulletToRow));
  if (error) {
    console.error("❌ insertJobResponsibilities", error.message, error);
  }
};
