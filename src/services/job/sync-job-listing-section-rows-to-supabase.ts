import { deleteJobNiceToHavesByJobAndExchange, insertJobNiceToHaves } from "../../data/job-nice-to-haves";
import { deleteJobRequirementsByJobAndExchange, insertJobRequirements } from "../../data/job-requirements";
import { deleteJobResponsibilitiesByJobAndExchange, insertJobResponsibilities } from "../../data/job-responsibilities";
import type { JobListingStructuredBulletRow } from "../../data/job-listing/types";
import { getManagedPgPool } from "../postgres";

const pickExchangeScope = (
  responsibilities: JobListingStructuredBulletRow[],
  requirements: JobListingStructuredBulletRow[],
  niceToHaves: JobListingStructuredBulletRow[],
): { jobId: string; exchangeId: string } | null => {
  const row = responsibilities[0] ?? requirements[0] ?? niceToHaves[0] ?? undefined;
  if (!row) {
    return null;
  }
  return { jobId: row.jobId, exchangeId: row.exchangeId };
};

/**
 * Deletes prior section bullets for this `job_id` + `exchange_id` in Postgres, then inserts the new rows.
 * No-op when DATABASE_URL is unset.
 */
export const syncJobListingSectionRowsToSupabase = async (params: {
  responsibilities: JobListingStructuredBulletRow[];
  requirements: JobListingStructuredBulletRow[];
  niceToHaves: JobListingStructuredBulletRow[];
}): Promise<void> => {
  const pool = getManagedPgPool();
  if (!pool) {
    return;
  }

  const { responsibilities, requirements, niceToHaves } = params;
  const scope = pickExchangeScope(responsibilities, requirements, niceToHaves);
  if (!scope) {
    return;
  }

  const { jobId, exchangeId } = scope;

  await deleteJobResponsibilitiesByJobAndExchange(pool, jobId, exchangeId);
  await deleteJobRequirementsByJobAndExchange(pool, jobId, exchangeId);
  await deleteJobNiceToHavesByJobAndExchange(pool, jobId, exchangeId);

  await insertJobResponsibilities(pool, responsibilities);
  await insertJobRequirements(pool, requirements);
  await insertJobNiceToHaves(pool, niceToHaves);

  if (responsibilities.length + requirements.length + niceToHaves.length > 0) {
    console.log("📤 Postgres: replaced job listing section rows for exchange", {
      jobId,
      exchangeId,
      responsibilities: responsibilities.length,
      requirements: requirements.length,
      niceToHaves: niceToHaves.length,
    });
  }
};
