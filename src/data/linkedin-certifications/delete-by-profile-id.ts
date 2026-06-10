import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Deletes all LinkedIn certification rows for one profile.
 */
export const deleteLinkedInCertificationsByProfileId = async (
  supabase: SupabaseClient,
  profileId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("linkedin_certifications")
    .delete()
    .eq("linkedin_profile_id", profileId);

  if (error) {
    console.error("❌ deleteLinkedInCertificationsByProfileId:", error.message);
    throw new Error(error.message);
  }
};
