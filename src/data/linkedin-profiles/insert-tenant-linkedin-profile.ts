import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import { insertRow } from "../../utils/postgres";
import type { LinkedInProfile } from "./types";
import { clearOtherTenantLinkedInProfileFlags } from "./clear-other-tenant-flags";
import { getLinkedInProfile } from "./get-linkedin-profile";

/**
 * Inserts a tenant LinkedIn profile row.
 */
export const insertTenantLinkedInProfile = async (
  pool: Pool,
  input: { linkedinUrl: string },
): Promise<LinkedInProfile> => {
  const id = randomUUID();
  const now = new Date().toISOString();
  const linkedinUrl = input.linkedinUrl.trim();

  await clearOtherTenantLinkedInProfileFlags(pool);

  try {
    await insertRow(pool, "linkedin_profiles", {
      id,
      is_tenant: true,
      linkedin_url: linkedinUrl,
      public_identifier: "",
      apify_profile_id: "",
      name: "",
      headline: "",
      location: "",
      synced_at: null,
      created_at: now,
      updated_at: now,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ insertTenantLinkedInProfile:", message);
    throw new Error(message);
  }

  const row = await getLinkedInProfile(pool, id);
  if (!row) {
    throw new Error("Failed to load LinkedIn profile after insert");
  }
  return row;
};
