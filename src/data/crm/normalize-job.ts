import type { Job, JobStatus, JobType } from "./types";

const isJobStatus = (value: unknown): value is JobStatus => {
  return value === "draft" || value === "applied" || value === "closed" || value === "archived";
};

const isJobType = (value: unknown): value is JobType => {
  return value === "job" || value === "contract";
};

/**
 * Fills defaults for legacy `jobs.json` rows missing listing snapshot fields.
 */
export const normalizeJob = (raw: unknown): Job => {
  const r = raw as Partial<Job> & Record<string, unknown>;
  const status = isJobStatus(r.status) ? r.status : "draft";
  const normalizeStringArray = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

  const jobType = isJobType(r.type) ? r.type : "job";

  return {
    id: typeof r.id === "string" ? r.id : "",
    companyId: typeof r.companyId === "string" ? r.companyId : "",
    type: jobType,
    title: typeof r.title === "string" ? r.title : "",
    url: typeof r.url === "string" ? r.url : "",
    status,
    description: typeof r.description === "string" ? r.description : "",
    listingImportedAt: typeof r.listingImportedAt === "string" ? r.listingImportedAt : "",
    latestScrapeRunId: typeof r.latestScrapeRunId === "string" ? r.latestScrapeRunId : "",
    latestAiExchangeId: typeof r.latestAiExchangeId === "string" ? r.latestAiExchangeId : "",
    responsibilities: normalizeStringArray(r.responsibilities),
    requirements: normalizeStringArray(r.requirements),
    niceToHaves: normalizeStringArray(r.niceToHaves),
    createdAt: typeof r.createdAt === "string" ? r.createdAt : "",
    updatedAt: typeof r.updatedAt === "string" ? r.updatedAt : "",
  };
};
