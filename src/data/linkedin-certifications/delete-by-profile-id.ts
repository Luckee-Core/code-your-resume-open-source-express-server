import type { Pool } from "pg";
import { deleteRows } from "../../utils/postgres";

/**
 * Deletes all LinkedIn certification rows for one profile.
 */
export const deleteLinkedInCertificationsByProfileId = async (
  pool: Pool,
  profileId: string,
): Promise<void> => {
  try {
    await deleteRows(pool, "linkedin_certifications", { linkedin_profile_id: profileId });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ deleteLinkedInCertificationsByProfileId:", message);
    throw new Error(message);
  }
};
