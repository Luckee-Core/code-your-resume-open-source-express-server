import type { Pool } from "pg";
import { selectOneFrom } from "../../utils/postgres";
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
  pool: Pool,
  id: string,
): Promise<LinkedInProfile | null> => {
  try {
    const data = await selectOneFrom<LinkedInProfileRow>(pool, "linkedin_profiles", {
      columns: LINKEDIN_PROFILE_SELECT_COLUMNS,
      eq: { id },
    });
    if (!data) return null;
    return mapLinkedInProfileRow(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ getLinkedInProfile:", message);
    throw new Error(message);
  }
};
