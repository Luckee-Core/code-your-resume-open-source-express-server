import type { Pool } from "pg";
import { deleteRows } from "../../utils/postgres";

/**
 * Deletes all LinkedIn employment rows for one profile.
 */
export const deleteLinkedInEmploymentsByProfileId = async (
  pool: Pool,
  profileId: string,
): Promise<void> => {
  try {
    await deleteRows(pool, "linkedin_employments", { linkedin_profile_id: profileId });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ deleteLinkedInEmploymentsByProfileId:", message);
    throw new Error(message);
  }
};
