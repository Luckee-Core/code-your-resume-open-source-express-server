import { toIsoTimestampString } from "../../utils/crm/to-iso-timestamp-string";
import type { LinkedInProfile, LinkedInProfileRow } from "./types";

/**
 * Maps a Supabase `linkedin_profiles` row to `LinkedInProfile`.
 */
export const mapLinkedInProfileRow = (row: LinkedInProfileRow): LinkedInProfile => ({
  id: row.id,
  isTenant: row.is_tenant,
  linkedinUrl: row.linkedin_url,
  publicIdentifier: row.public_identifier,
  apifyProfileId: row.apify_profile_id,
  name: row.name,
  headline: row.headline,
  location: row.location,
  syncedAt: row.synced_at ? toIsoTimestampString(row.synced_at) : null,
  createdAt: toIsoTimestampString(row.created_at),
  updatedAt: toIsoTimestampString(row.updated_at),
});
