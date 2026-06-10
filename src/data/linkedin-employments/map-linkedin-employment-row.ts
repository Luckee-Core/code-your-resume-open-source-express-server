import { toIsoTimestampString } from "../../utils/crm/to-iso-timestamp-string";
import type { LinkedInEmployment, LinkedInEmploymentRow } from "./types";

/**
 * Maps a Supabase `linkedin_employments` row to `LinkedInEmployment`.
 */
export const mapLinkedInEmploymentRow = (row: LinkedInEmploymentRow): LinkedInEmployment => ({
  id: row.id,
  linkedinProfileId: row.linkedin_profile_id,
  sortOrder: row.sort_order,
  position: row.position,
  companyName: row.company_name,
  location: row.location,
  employmentType: row.employment_type,
  workplaceType: row.workplace_type,
  description: row.description,
  duration: row.duration,
  companyLinkedinUrl: row.company_linkedin_url,
  startMonth: row.start_month,
  startYear: row.start_year,
  endMonth: row.end_month,
  endYear: row.end_year,
  isCurrent: row.is_current,
  createdAt: toIsoTimestampString(row.created_at),
  updatedAt: toIsoTimestampString(row.updated_at),
});
