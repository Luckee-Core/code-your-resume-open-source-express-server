import type { JobListingStructuredBulletRow } from "../job-listing/types";

export type JobListingSectionSnakeBullet = {
  id: string;
  job_id: string;
  scrape_run_id: string;
  exchange_id: string;
  body: string;
  sort_order: number;
  created_at: string;
};

/**
 * Maps a structured bullet domain row to the snake_case insert payload.
 */
export const mapStructuredBulletToRow = (
  row: JobListingStructuredBulletRow,
): JobListingSectionSnakeBullet => ({
  id: row.id,
  job_id: row.jobId,
  scrape_run_id: row.scrapeRunId,
  exchange_id: row.exchangeId,
  body: row.body,
  sort_order: row.sortOrder,
  created_at: row.createdAt,
});
