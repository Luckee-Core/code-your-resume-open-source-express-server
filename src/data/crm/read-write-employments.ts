import { randomUUID } from "node:crypto";
import type { Employment } from "./types";
import { readJsonArray, writeJsonArray } from "./crm-json-io";
import { normalizeEmployment } from "./normalize-employment";

const FILE = "employments.json";

export const listEmploymentsFromStore = async (): Promise<Employment[]> => {
  const rows = await readJsonArray<unknown>(FILE, []);
  return rows.map((r) => normalizeEmployment(r));
};

export const createEmploymentInStore = async (input: {
  companyId: string;
  jobId: string;
  startDate: string;
  endDate: string;
}): Promise<Employment> => {
  const rows = await readJsonArray<unknown>(FILE, []);
  const now = new Date().toISOString();
  const row: Employment = normalizeEmployment({
    id: randomUUID(),
    companyId: input.companyId.trim(),
    jobId: input.jobId.trim(),
    startDate: input.startDate.trim(),
    endDate: typeof input.endDate === "string" ? input.endDate.trim() : "",
    createdAt: now,
    updatedAt: now,
  });
  rows.push(row);
  await writeJsonArray(FILE, rows);
  return row;
};

export const getEmploymentFromStore = async (id: string): Promise<Employment | null> => {
  const rows = await readJsonArray<unknown>(FILE, []);
  const raw = rows.find((r) => normalizeEmployment(r).id === id);
  return raw !== undefined ? normalizeEmployment(raw) : null;
};

export const updateEmploymentInStore = async (
  id: string,
  patch: Partial<Pick<Employment, "companyId" | "jobId" | "startDate" | "endDate">>,
): Promise<Employment | null> => {
  const rows = await readJsonArray<unknown>(FILE, []);
  const idx = rows.findIndex((r) => normalizeEmployment(r).id === id);
  if (idx < 0) return null;
  const cur = normalizeEmployment(rows[idx]);
  const next: Employment = normalizeEmployment({
    ...cur,
    ...(patch.companyId !== undefined ? { companyId: patch.companyId } : {}),
    ...(patch.jobId !== undefined ? { jobId: patch.jobId } : {}),
    ...(patch.startDate !== undefined ? { startDate: patch.startDate } : {}),
    ...(patch.endDate !== undefined ? { endDate: patch.endDate } : {}),
    updatedAt: new Date().toISOString(),
  });
  rows[idx] = next;
  await writeJsonArray(FILE, rows);
  return next;
};

export const deleteEmploymentFromStore = async (id: string): Promise<boolean> => {
  const rows = await readJsonArray<unknown>(FILE, []);
  const next = rows.filter((r) => normalizeEmployment(r).id !== id);
  if (next.length === rows.length) return false;
  await writeJsonArray(FILE, next);
  return true;
};
