import { randomUUID } from "node:crypto";
import { readJobListingJsonArray, writeJobListingJsonArray } from "./job-listing-json-io";
import type { JobListingScrapeRun } from "./types";

const FILENAME = "job-listing-scrape-runs.json";

export const listJobListingScrapeRunsFromStore = async (): Promise<JobListingScrapeRun[]> =>
  readJobListingJsonArray<JobListingScrapeRun>(FILENAME, []);

export const appendJobListingScrapeRun = async (row: JobListingScrapeRun): Promise<JobListingScrapeRun> => {
  const rows = await listJobListingScrapeRunsFromStore();
  rows.push(row);
  await writeJobListingJsonArray(FILENAME, rows);
  return row;
};

export const updateJobListingScrapeRunById = async (
  id: string,
  patch: Partial<Omit<JobListingScrapeRun, "id">>,
): Promise<JobListingScrapeRun | null> => {
  const rows = await listJobListingScrapeRunsFromStore();
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  rows[idx] = { ...rows[idx], ...patch };
  await writeJobListingJsonArray(FILENAME, rows);
  return rows[idx];
};

export const createPendingJobListingScrapeRun = async (input: {
  jobId: string;
  sourceUrl: string;
}): Promise<JobListingScrapeRun> => {
  const now = new Date().toISOString();
  const row: JobListingScrapeRun = {
    id: randomUUID(),
    jobId: input.jobId,
    sourceUrl: input.sourceUrl,
    status: "pending",
    httpStatus: null,
    plainText: "",
    error: "",
    startedAt: now,
    completedAt: "",
  };
  return appendJobListingScrapeRun(row);
};
