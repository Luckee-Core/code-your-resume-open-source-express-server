import type { SupabaseClient } from "@supabase/supabase-js";
import {
  LINKEDIN_PROFILE_SELECT_COLUMNS,
  type LinkedInProfile,
  type LinkedInProfileRow,
} from "./types";
import { mapLinkedInProfileRow } from "./map-linkedin-profile-row";

/**
 * Loads one LinkedIn profile by id.
 */
export const getLinkedInProfile = async (
  supabase: SupabaseClient,
  id: string,
): Promise<LinkedInProfile | null> => {
  const { data, error } = await supabase
    .from("linkedin_profiles")
    .select(LINKEDIN_PROFILE_SELECT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("❌ getLinkedInProfile:", error.message);
    throw new Error(error.message);
  }

  if (!data) return null;
  return mapLinkedInProfileRow(data as LinkedInProfileRow);
};
