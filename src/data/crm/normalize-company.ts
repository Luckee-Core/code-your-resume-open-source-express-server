import type { Company } from "./types";

/**
 * Fills defaults for legacy `companies.json` rows missing site-discovery fields.
 */
export const normalizeCompany = (raw: unknown): Company => {
  const r = raw as Partial<Company> & Record<string, unknown>;
  const urlsRaw = r.websiteUrls;
  const urls = Array.isArray(urlsRaw)
    ? urlsRaw.filter((u): u is string => typeof u === "string").map((s) => s.trim()).filter(Boolean)
    : [];
  return {
    id: typeof r.id === "string" ? r.id : "",
    name: typeof r.name === "string" ? r.name : "",
    website: typeof r.website === "string" ? r.website : "",
    notes: typeof r.notes === "string" ? r.notes : "",
    websiteUrls: urls,
    playwrightWebsiteUrlDiscoveryAttempted: r.playwrightWebsiteUrlDiscoveryAttempted === true,
    websiteResearchSummary: typeof r.websiteResearchSummary === "string" ? r.websiteResearchSummary : "",
    websiteResearchCompletedAt:
      typeof r.websiteResearchCompletedAt === "string" ? r.websiteResearchCompletedAt : "",
    createdAt: typeof r.createdAt === "string" ? r.createdAt : "",
    updatedAt: typeof r.updatedAt === "string" ? r.updatedAt : "",
  };
};
