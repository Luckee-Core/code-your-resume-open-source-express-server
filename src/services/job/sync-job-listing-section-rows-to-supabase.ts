import { deleteJobNiceToHavesByJobAndExchange, insertJobNiceToHaves } from "../../data/job-nice-to-haves";
import { deleteJobRequirementsByJobAndExchange, insertJobRequirements } from "../../data/job-requirements";
import { deleteJobResponsibilitiesByJobAndExchange, insertJobResponsibilities } from "../../data/job-responsibilities";
import type { JobListingStructuredBulletRow } from "../../data/job-listing/types";
import { getSupabaseCrmMirrorClient } from "../supabase/get-supabase-crm-mirror-client";

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
 * Deletes prior section bullets for this `job_id` + `exchange_id` in Supabase, then inserts the new rows.
 * No-op when Supabase env is unset. Logs PostgREST errors without throwing.
 */
export const syncJobListingSectionRowsToSupabase = async (params: {
  responsibilities: JobListingStructuredBulletRow[];
  requirements: JobListingStructuredBulletRow[];
  niceToHaves: JobListingStructuredBulletRow[];
}): Promise<void> => {
  const client = getSupabaseCrmMirrorClient();
  if (!client) {
    return;
  }

  const { responsibilities, requirements, niceToHaves } = params;
  const scope = pickExchangeScope(responsibilities, requirements, niceToHaves);
  if (!scope) {
    return;
  }

  const { jobId, exchangeId } = scope;

  await deleteJobResponsibilitiesByJobAndExchange(client, jobId, exchangeId);
  await deleteJobRequirementsByJobAndExchange(client, jobId, exchangeId);
  await deleteJobNiceToHavesByJobAndExchange(client, jobId, exchangeId);

  await insertJobResponsibilities(client, responsibilities);
  await insertJobRequirements(client, requirements);
  await insertJobNiceToHaves(client, niceToHaves);

  if (responsibilities.length + requirements.length + niceToHaves.length > 0) {
    console.log("📤 Supabase: replaced job listing section rows for exchange", {
      jobId,
      exchangeId,
      responsibilities: responsibilities.length,
      requirements: requirements.length,
      niceToHaves: niceToHaves.length,
    });
  }
};
