import type { SupabaseClient } from "@supabase/supabase-js";
import {
  LINKEDIN_EMPLOYMENT_SELECT_COLUMNS,
  type LinkedInEmployment,
  type LinkedInEmploymentRow,
} from "./types";
import { mapLinkedInEmploymentRow } from "./map-linkedin-employment-row";

/**
 * Lists LinkedIn employment rows for one profile.
 */
export const listLinkedInEmploymentsByProfileId = async (
  supabase: SupabaseClient,
  profileId: string,
): Promise<LinkedInEmployment[]> => {
  const { data, error } = await supabase
    .from("linkedin_employments")
    .select(LINKEDIN_EMPLOYMENT_SELECT_COLUMNS)
    .eq("linkedin_profile_id", profileId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("❌ listLinkedInEmploymentsByProfileId:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapLinkedInEmploymentRow(row as LinkedInEmploymentRow));
};
