import type { Pool } from "pg";
import { updateRows } from "../../utils/postgres";
import type { LinkedInProfile } from "./types";
import { getLinkedInProfile } from "./get-linkedin-profile";

export type UpdateLinkedInProfileInput = {
  linkedinUrl?: string;
  publicIdentifier?: string;
  apifyProfileId?: string;
  name?: string;
  headline?: string;
  location?: string;
  syncedAt?: string | null;
};

/**
 * Updates one LinkedIn profile row.
 */
export const updateLinkedInProfile = async (
  pool: Pool,
  id: string,
  patch: UpdateLinkedInProfileInput,
): Promise<LinkedInProfile | null> => {
  const prev = await getLinkedInProfile(pool, id);
  if (!prev) return null;

  const updatedAt = new Date().toISOString();
  const row: Record<string, unknown> = { updated_at: updatedAt };

  if (patch.linkedinUrl !== undefined) row.linkedin_url = patch.linkedinUrl.trim();
  if (patch.publicIdentifier !== undefined) row.public_identifier = patch.publicIdentifier;
  if (patch.apifyProfileId !== undefined) row.apify_profile_id = patch.apifyProfileId;
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.headline !== undefined) row.headline = patch.headline;
  if (patch.location !== undefined) row.location = patch.location;
  if (patch.syncedAt !== undefined) row.synced_at = patch.syncedAt;

  try {
    await updateRows(pool, "linkedin_profiles", row, { id });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ updateLinkedInProfile:", message);
    throw new Error(message);
  }

  return getLinkedInProfile(pool, id);
};
