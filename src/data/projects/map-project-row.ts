import type { Project, ProjectRow } from "./types";
import { toIsoTimestampString } from "../../utils/crm/to-iso-timestamp-string";

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
};

/**
 * Maps a Supabase `projects` row to the CRM `Project` type.
 */
export const mapProjectRow = (row: ProjectRow): Project => ({
  id: row.id,
  businessName: row.business_name,
  description: row.description ?? "",
  url: row.url ?? "",
  duration: row.duration ?? "",
  technologies: toStringArray(row.technologies),
  websiteResearchSummary: row.website_research_summary ?? "",
  websiteResearchCompletedAt: row.website_research_completed_at
    ? toIsoTimestampString(row.website_research_completed_at)
    : "",
  createdAt: toIsoTimestampString(row.created_at),
  updatedAt: toIsoTimestampString(row.updated_at),
});
