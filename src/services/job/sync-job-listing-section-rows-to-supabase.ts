import type { JobListingStructuredBulletRow } from "../../data/job-listing/types";
import { getSupabaseCrmMirrorClient } from "../supabase/get-supabase-crm-mirror-client";

type SnakeBullet = {
  id: string;
  job_id: string;
  scrape_run_id: string;
  exchange_id: string;
  body: string;
  sort_order: number;
  created_at: string;
};

const toSnakeBullet = (r: JobListingStructuredBulletRow): SnakeBullet => ({
  id: r.id,
  job_id: r.jobId,
  scrape_run_id: r.scrapeRunId,
  exchange_id: r.exchangeId,
  body: r.body,
  sort_order: r.sortOrder,
  created_at: r.createdAt,
});

const pickExchangeScope = (
  responsibilities: JobListingStructuredBulletRow[],
  requirements: JobListingStructuredBulletRow[],
  niceToHaves: JobListingStructuredBulletRow[],
): { jobId: string; exchangeId: string } | null => {
  const row =
    responsibilities[0] ?? requirements[0] ?? niceToHaves[0] ?? undefined;
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

  const del = async (table: string): Promise<void> => {
    const { error } = await client.from(table).delete().eq("job_id", jobId).eq("exchange_id", exchangeId);
    if (error) {
      console.error(`❌ Supabase ${table} delete (exchange scope)`, error.message, error);
    }
  };

  await del("job_responsibilities");
  await del("job_requirements");
  await del("job_nice_to_have");

  if (responsibilities.length > 0) {
    const { error } = await client
      .from("job_responsibilities")
      .insert(responsibilities.map(toSnakeBullet));
    if (error) {
      console.error("❌ Supabase job_responsibilities insert", error.message, error);
    }
  }

  if (requirements.length > 0) {
    const { error } = await client.from("job_requirements").insert(requirements.map(toSnakeBullet));
    if (error) {
      console.error("❌ Supabase job_requirements insert", error.message, error);
    }
  }

  if (niceToHaves.length > 0) {
    const { error } = await client.from("job_nice_to_have").insert(niceToHaves.map(toSnakeBullet));
    if (error) {
      console.error("❌ Supabase job_nice_to_have insert", error.message, error);
    }
  }

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
