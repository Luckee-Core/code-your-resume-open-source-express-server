import { randomUUID } from "node:crypto";
import type { Job, JobStatus, JobType } from "./types";
import { readJsonArray, writeJsonArray } from "./crm-json-io";
import { normalizeJob } from "./normalize-job";

const FILE = "jobs.json";

const isJobStatus = (value: unknown): value is JobStatus => {
  return value === "draft" || value === "applied" || value === "closed" || value === "archived";
};

export const listJobsFromStore = async (): Promise<Job[]> => {
  const rows = await readJsonArray<unknown>(FILE, []);
  return rows.map((r) => normalizeJob(r));
};

export const createJobInStore = async (input: {
  companyId: string;
  type?: JobType;
  title: string;
  url: string;
  status: JobStatus;
}): Promise<Job> => {
  const rows = await readJsonArray<unknown>(FILE, []);
  const now = new Date().toISOString();
  const status = isJobStatus(input.status) ? input.status : "draft";
  const row: Job = normalizeJob({
    id: randomUUID(),
    companyId: input.companyId,
    type: input.type ?? "job",
    title: input.title.trim(),
    url: input.url.trim(),
    status,
    description: "",
    listingImportedAt: "",
    latestScrapeRunId: "",
    latestAiExchangeId: "",
    createdAt: now,
    updatedAt: now,
  });
  rows.push(row);
  await writeJsonArray(FILE, rows);
  return row;
};

export const getJobFromStore = async (id: string): Promise<Job | null> => {
  const rows = await readJsonArray<unknown>(FILE, []);
  const raw = rows.find((r) => normalizeJob(r).id === id);
  return raw !== undefined ? normalizeJob(raw) : null;
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
  const rows = await readJsonArray<unknown>(FILE, []);
  const idx = rows.findIndex((r) => normalizeJob(r).id === id);
  if (idx === -1) return null;
  const prev = normalizeJob(rows[idx]);
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
  rows[idx] = next;
  await writeJsonArray(FILE, rows);
  return next;
};

export const deleteJobFromStore = async (id: string): Promise<boolean> => {
  const rows = await readJsonArray<unknown>(FILE, []);
  const next = rows.filter((r) => normalizeJob(r).id !== id);
  if (next.length === rows.length) return false;
  await writeJsonArray(FILE, next);
  return true;
};
