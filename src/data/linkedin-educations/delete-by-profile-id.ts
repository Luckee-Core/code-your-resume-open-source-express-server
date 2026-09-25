import type { Pool } from "pg";
import { deleteRows } from "../../utils/postgres";

/**
 * Deletes all LinkedIn education rows for one profile.
 */
export const deleteLinkedInEducationsByProfileId = async (
  pool: Pool,
  profileId: string,
): Promise<void> => {
  try {
    await deleteRows(pool, "linkedin_educations", { linkedin_profile_id: profileId });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ deleteLinkedInEducationsByProfileId:", message);
    throw new Error(message);
  }
};
