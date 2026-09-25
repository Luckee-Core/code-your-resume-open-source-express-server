import type { Pool } from "pg";
import { mapStructuredBulletToRow } from "../job-listing-sections/map-structured-bullet-to-row";
import type { JobListingStructuredBulletRow } from "../job-listing/types";
import { insertRows } from "../../utils/postgres";

/**
 * Inserts `job_responsibilities` rows.
 */
export const insertJobResponsibilities = async (
  pool: Pool,
  rows: JobListingStructuredBulletRow[],
): Promise<void> => {
  if (rows.length === 0) {
    return;
  }
  await insertRows(
    pool,
    "job_responsibilities",
    rows.map((row) => ({ ...mapStructuredBulletToRow(row) })),
  );
};
