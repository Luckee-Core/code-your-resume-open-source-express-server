import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { LinkedInProfile } from "./types";
import { clearOtherTenantLinkedInProfileFlags } from "./clear-other-tenant-flags";
import { getLinkedInProfile } from "./get-linkedin-profile";

/**
 * Inserts a tenant LinkedIn profile row.
 */
export const insertTenantLinkedInProfile = async (
  supabase: SupabaseClient,
  input: { linkedinUrl: string },
): Promise<LinkedInProfile> => {
  const id = randomUUID();
  const now = new Date().toISOString();
  const linkedinUrl = input.linkedinUrl.trim();

  await clearOtherTenantLinkedInProfileFlags(supabase);

  const { error } = await supabase.from("linkedin_profiles").insert({
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

  if (error) {
    console.error("❌ insertTenantLinkedInProfile:", error.message);
    throw new Error(error.message);
  }

  const row = await getLinkedInProfile(supabase, id);
  if (!row) {
    throw new Error("Failed to load LinkedIn profile after insert");
  }
  return row;
};
