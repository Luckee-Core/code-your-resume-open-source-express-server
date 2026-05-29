import { randomUUID } from "node:crypto";
import type { Job, JobStatus, JobType } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getJobFromSupabase } from "./supabase/get-job-from-supabase";
import { listJobsFromSupabase } from "./supabase/list-jobs-from-supabase";

const isJobStatus = (value: unknown): value is JobStatus => {
  return value === "draft" || value === "applied" || value === "closed" || value === "archived";
};

export const listJobsFromStore = async (): Promise<Job[]> => {
  return listJobsFromSupabase(requireCrmSupabaseClient());
};

export const createJobInStore = async (input: {
  companyId: string;
  type?: JobType;
  title: string;
  url: string;
  status: JobStatus;
}): Promise<Job> => {
  const supabase = requireCrmSupabaseClient();
  const id = randomUUID();
  const now = new Date().toISOString();
  const status = isJobStatus(input.status) ? input.status : "draft";

  const { error } = await supabase.from("jobs").insert({
    id,
    company_id: input.companyId,
    title: input.title.trim(),
    url: input.url.trim(),
    status,
    description: "",
    listing_imported_at: null,
    latest_scrape_run_id: null,
    latest_ai_exchange_id: null,
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error("❌ createJobInStore:", error.message);
    throw new Error(error.message);
  }

  const row = await getJobFromSupabase(supabase, id);
  if (!row) {
    throw new Error("Failed to load job after insert");
  }
  return { ...row, type: input.type ?? "job" };
};

export const getJobFromStore = async (id: string): Promise<Job | null> => {
  return getJobFromSupabase(requireCrmSupabaseClient(), id);
};

export const updateJobInStore = async (
  id: string,
  patch: Partial<
    Pick<
      Job,
      | "companyId"
      | "type"
      | "title"
      | "url"
      | "status"
      | "description"
      | "listingImportedAt"
      | "latestScrapeRunId"
      | "latestAiExchangeId"
    >
  >,
): Promise<Job | null> => {
  const supabase = requireCrmSupabaseClient();
  const prev = await getJobFromSupabase(supabase, id);
  if (!prev) {
    return null;
  }

  const status =
    patch.status !== undefined && isJobStatus(patch.status) ? patch.status : prev.status;
  const next: Job = {
    ...prev,
    companyId: patch.companyId !== undefined ? patch.companyId : prev.companyId,
    type: patch.type !== undefined ? patch.type : prev.type,
    title: patch.title !== undefined ? patch.title.trim() : prev.title,
    url: patch.url !== undefined ? patch.url.trim() : prev.url,
    status,
    description: patch.description !== undefined ? patch.description : prev.description,
    listingImportedAt:
      patch.listingImportedAt !== undefined ? patch.listingImportedAt : prev.listingImportedAt,
    latestScrapeRunId:
      patch.latestScrapeRunId !== undefined ? patch.latestScrapeRunId : prev.latestScrapeRunId,
    latestAiExchangeId:
      patch.latestAiExchangeId !== undefined ? patch.latestAiExchangeId : prev.latestAiExchangeId,
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("jobs")
    .update({
      company_id: next.companyId,
      title: next.title,
      url: next.url,
      status: next.status,
      description: next.description,
      listing_imported_at: next.listingImportedAt.trim() ? next.listingImportedAt : null,
      latest_scrape_run_id: next.latestScrapeRunId.trim() ? next.latestScrapeRunId : null,
      latest_ai_exchange_id: next.latestAiExchangeId.trim() ? next.latestAiExchangeId : null,
      updated_at: next.updatedAt,
    })
    .eq("id", id);

  if (error) {
    console.error("❌ updateJobInStore:", error.message);
    throw new Error(error.message);
  }

  return next;
};

export const deleteJobFromStore = async (id: string): Promise<boolean> => {
  const supabase = requireCrmSupabaseClient();
  const { data, error } = await supabase.from("jobs").delete().eq("id", id).select("id");

  if (error) {
    console.error("❌ deleteJobFromStore:", error.message);
    throw new Error(error.message);
  }

  return (data?.length ?? 0) > 0;
};
