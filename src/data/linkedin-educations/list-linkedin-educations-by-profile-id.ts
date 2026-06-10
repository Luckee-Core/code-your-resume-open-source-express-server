import type { SupabaseClient } from "@supabase/supabase-js";
import {
  LINKEDIN_EDUCATION_SELECT_COLUMNS,
  type LinkedInEducation,
  type LinkedInEducationRow,
} from "./types";
import { mapLinkedInEducationRow } from "./map-linkedin-education-row";

/**
 * Lists LinkedIn education rows for one profile.
 */
export const listLinkedInEducationsByProfileId = async (
  supabase: SupabaseClient,
  profileId: string,
): Promise<LinkedInEducation[]> => {
  const { data, error } = await supabase
    .from("linkedin_educations")
    .select(LINKEDIN_EDUCATION_SELECT_COLUMNS)
    .eq("linkedin_profile_id", profileId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("❌ listLinkedInEducationsByProfileId:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapLinkedInEducationRow(row as LinkedInEducationRow));
};
