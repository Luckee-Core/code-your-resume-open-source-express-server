import type { Pool } from "pg";
import { mapStructuredBulletToRow } from "../job-listing-sections/map-structured-bullet-to-row";
import type { JobListingStructuredBulletRow } from "../job-listing/types";
import { insertRows } from "../../utils/postgres";

/**
 * Inserts `job_nice_to_have` rows.
 */
export const insertJobNiceToHaves = async (
  pool: Pool,
  rows: JobListingStructuredBulletRow[],
): Promise<void> => {
  if (rows.length === 0) {
    return;
  }
  await insertRows(
    pool,
    "job_nice_to_have",
    rows.map((row) => ({ ...mapStructuredBulletToRow(row) })),
  );
};
