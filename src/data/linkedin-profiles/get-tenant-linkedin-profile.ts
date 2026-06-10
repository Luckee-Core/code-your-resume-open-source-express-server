import type { SupabaseClient } from "@supabase/supabase-js";
import {
  LINKEDIN_PROFILE_SELECT_COLUMNS,
  type LinkedInProfile,
  type LinkedInProfileRow,
} from "./types";
import { mapLinkedInProfileRow } from "./map-linkedin-profile-row";

/**
 * Loads the tenant LinkedIn profile row, if any.
 */
export const getTenantLinkedInProfile = async (
  supabase: SupabaseClient,
): Promise<LinkedInProfile | null> => {
  const { data, error } = await supabase
    .from("linkedin_profiles")
    .select(LINKEDIN_PROFILE_SELECT_COLUMNS)
    .eq("is_tenant", true)
    .maybeSingle();

  if (error) {
    console.error("❌ getTenantLinkedInProfile:", error.message);
    throw new Error(error.message);
  }

  if (!data) return null;
  return mapLinkedInProfileRow(data as LinkedInProfileRow);
};
