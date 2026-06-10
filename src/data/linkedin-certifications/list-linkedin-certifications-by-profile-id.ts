import type { SupabaseClient } from "@supabase/supabase-js";
import {
  LINKEDIN_CERTIFICATION_SELECT_COLUMNS,
  type LinkedInCertification,
  type LinkedInCertificationRow,
} from "./types";
import { mapLinkedInCertificationRow } from "./map-linkedin-certification-row";

/**
 * Lists LinkedIn certification rows for one profile.
 */
export const listLinkedInCertificationsByProfileId = async (
  supabase: SupabaseClient,
  profileId: string,
): Promise<LinkedInCertification[]> => {
  const { data, error } = await supabase
    .from("linkedin_certifications")
    .select(LINKEDIN_CERTIFICATION_SELECT_COLUMNS)
    .eq("linkedin_profile_id", profileId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("❌ listLinkedInCertificationsByProfileId:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapLinkedInCertificationRow(row as LinkedInCertificationRow));
};
