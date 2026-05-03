import { randomUUID } from "node:crypto";
import type { Company } from "./types";
import { readJsonArray, writeJsonArray } from "./crm-json-io";
import { normalizeCompany } from "./normalize-company";

const FILE = "companies.json";

export const listCompaniesFromStore = async (): Promise<Company[]> => {
  const rows = await readJsonArray<unknown>(FILE, []);
  return rows.map((r) => normalizeCompany(r));
};

export const createCompanyInStore = async (input: {
  name: string;
  website: string;
  notes: string;
}): Promise<Company> => {
  const rows = await readJsonArray<unknown>(FILE, []);
  const now = new Date().toISOString();
  const row: Company = normalizeCompany({
    id: randomUUID(),
    name: input.name.trim(),
    website: input.website.trim(),
    notes: input.notes.trim(),
    websiteUrls: [],
    playwrightWebsiteUrlDiscoveryAttempted: false,
    websiteResearchSummary: "",
    websiteResearchCompletedAt: "",
    createdAt: now,
    updatedAt: now,
  });
  rows.push(row);
  await writeJsonArray(FILE, rows);
  return row;
};

export const getCompanyFromStore = async (id: string): Promise<Company | null> => {
  const rows = await readJsonArray<unknown>(FILE, []);
  const raw = rows.find((r) => normalizeCompany(r).id === id);
  return raw !== undefined ? normalizeCompany(raw) : null;
};

export const updateCompanyInStore = async (
  id: string,
  patch: Partial<
    Pick<
      Company,
      | "name"
      | "website"
      | "notes"
      | "websiteUrls"
      | "playwrightWebsiteUrlDiscoveryAttempted"
      | "websiteResearchSummary"
      | "websiteResearchCompletedAt"
    >
  >,
): Promise<Company | null> => {
  const rows = await readJsonArray<unknown>(FILE, []);
  const idx = rows.findIndex((r) => normalizeCompany(r).id === id);
  if (idx === -1) return null;
  const prev = normalizeCompany(rows[idx]);
  const next: Company = {
    ...prev,
    name: patch.name !== undefined ? patch.name.trim() : prev.name,
    website: patch.website !== undefined ? patch.website.trim() : prev.website,
    notes: patch.notes !== undefined ? patch.notes.trim() : prev.notes,
    websiteUrls: patch.websiteUrls !== undefined ? patch.websiteUrls : prev.websiteUrls,
    playwrightWebsiteUrlDiscoveryAttempted:
      patch.playwrightWebsiteUrlDiscoveryAttempted !== undefined
        ? patch.playwrightWebsiteUrlDiscoveryAttempted
        : prev.playwrightWebsiteUrlDiscoveryAttempted,
    websiteResearchSummary:
      patch.websiteResearchSummary !== undefined
        ? patch.websiteResearchSummary
        : prev.websiteResearchSummary,
    websiteResearchCompletedAt:
      patch.websiteResearchCompletedAt !== undefined
        ? patch.websiteResearchCompletedAt
        : prev.websiteResearchCompletedAt,
    updatedAt: new Date().toISOString(),
  };
  rows[idx] = next;
  await writeJsonArray(FILE, rows);
  return next;
};

export const deleteCompanyFromStore = async (id: string): Promise<boolean> => {
  const rows = await readJsonArray<unknown>(FILE, []);
  const next = rows.filter((r) => normalizeCompany(r).id !== id);
  if (next.length === rows.length) return false;
  await writeJsonArray(FILE, next);
  return true;
};
