import { toIsoTimestampString } from "../../utils/crm/to-iso-timestamp-string";
import type { LinkedInCertification, LinkedInCertificationRow } from "./types";

/**
 * Maps a Supabase `linkedin_certifications` row to `LinkedInCertification`.
 */
export const mapLinkedInCertificationRow = (
  row: LinkedInCertificationRow,
): LinkedInCertification => ({
  id: row.id,
  linkedinProfileId: row.linkedin_profile_id,
  sortOrder: row.sort_order,
  title: row.title,
  issuedAt: row.issued_at,
  issuedBy: row.issued_by,
  issuedByLink: row.issued_by_link,
  createdAt: toIsoTimestampString(row.created_at),
  updatedAt: toIsoTimestampString(row.updated_at),
});
