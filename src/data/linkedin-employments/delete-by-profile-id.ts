import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Deletes all LinkedIn employment rows for one profile.
 */
export const deleteLinkedInEmploymentsByProfileId = async (
  supabase: SupabaseClient,
  profileId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("linkedin_employments")
    .delete()
    .eq("linkedin_profile_id", profileId);

  if (error) {
    console.error("❌ deleteLinkedInEmploymentsByProfileId:", error.message);
    throw new Error(error.message);
  }
};
