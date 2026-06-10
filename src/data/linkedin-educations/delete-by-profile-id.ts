import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Deletes all LinkedIn education rows for one profile.
 */
export const deleteLinkedInEducationsByProfileId = async (
  supabase: SupabaseClient,
  profileId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("linkedin_educations")
    .delete()
    .eq("linkedin_profile_id", profileId);

  if (error) {
    console.error("❌ deleteLinkedInEducationsByProfileId:", error.message);
    throw new Error(error.message);
  }
};
