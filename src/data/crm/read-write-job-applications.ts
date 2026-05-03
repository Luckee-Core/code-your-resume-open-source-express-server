import { randomUUID } from "node:crypto";
import type { JobApplication } from "./types";
import { readJsonArray, writeJsonArray } from "./crm-json-io";

const FILE = "job-applications.json";

export const listJobApplicationsFromStore = async (): Promise<JobApplication[]> => {
  return readJsonArray<JobApplication>(FILE, []);
};

export const createJobApplicationInStore = async (input: {
  jobId: string;
  submittedAt: string;
  imageGraphicId: string;
  notes: string;
}): Promise<JobApplication> => {
  const rows = await listJobApplicationsFromStore();
  const now = new Date().toISOString();
  const row: JobApplication = {
    id: randomUUID(),
    jobId: input.jobId,
    submittedAt: input.submittedAt,
    imageGraphicId: input.imageGraphicId.trim(),
    notes: input.notes.trim(),
    createdAt: now,
    updatedAt: now,
  };
  rows.push(row);
  await writeJsonArray(FILE, rows);
  return row;
};

export const getJobApplicationFromStore = async (id: string): Promise<JobApplication | null> => {
  const rows = await listJobApplicationsFromStore();
  return rows.find((r) => r.id === id) ?? null;
};

export const updateJobApplicationInStore = async (
  id: string,
  patch: Partial<Pick<JobApplication, "jobId" | "submittedAt" | "imageGraphicId" | "notes">>,
): Promise<JobApplication | null> => {
  const rows = await listJobApplicationsFromStore();
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const prev = rows[idx]!;
  const next: JobApplication = {
    ...prev,
    jobId: patch.jobId !== undefined ? patch.jobId : prev.jobId,
    submittedAt: patch.submittedAt !== undefined ? patch.submittedAt : prev.submittedAt,
    imageGraphicId:
      patch.imageGraphicId !== undefined ? patch.imageGraphicId.trim() : prev.imageGraphicId,
    notes: patch.notes !== undefined ? patch.notes.trim() : prev.notes,
    updatedAt: new Date().toISOString(),
  };
  rows[idx] = next;
  await writeJsonArray(FILE, rows);
  return next;
};

export const deleteJobApplicationFromStore = async (id: string): Promise<boolean> => {
  const rows = await listJobApplicationsFromStore();
  const next = rows.filter((r) => r.id !== id);
  if (next.length === rows.length) return false;
  await writeJsonArray(FILE, next);
  return true;
};
