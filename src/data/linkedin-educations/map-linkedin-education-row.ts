import { toIsoTimestampString } from "../../utils/crm/to-iso-timestamp-string";
import type { LinkedInEducation, LinkedInEducationRow } from "./types";

/**
 * Maps a Supabase `linkedin_educations` row to `LinkedInEducation`.
 */
export const mapLinkedInEducationRow = (row: LinkedInEducationRow): LinkedInEducation => ({
  id: row.id,
  linkedinProfileId: row.linkedin_profile_id,
  sortOrder: row.sort_order,
  schoolName: row.school_name,
  degree: row.degree,
  fieldOfStudy: row.field_of_study,
  period: row.period,
  schoolLinkedinUrl: row.school_linkedin_url,
  startYear: row.start_year,
  endYear: row.end_year,
  createdAt: toIsoTimestampString(row.created_at),
  updatedAt: toIsoTimestampString(row.updated_at),
});
