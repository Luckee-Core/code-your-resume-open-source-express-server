import type { Pool } from "pg";
import { selectOneFrom } from "../../utils/postgres";
import {
  LINKEDIN_PROFILE_SELECT_COLUMNS,
  type LinkedInProfile,
  type LinkedInProfileRow,
} from "./types";
import { mapLinkedInProfileRow } from "./map-linkedin-profile-row";

/**
 * Loads the tenant LinkedIn profile row, if any.
 */
export const getTenantLinkedInProfile = async (
  pool: Pool,
): Promise<LinkedInProfile | null> => {
  try {
    const data = await selectOneFrom<LinkedInProfileRow>(pool, "linkedin_profiles", {
      columns: LINKEDIN_PROFILE_SELECT_COLUMNS,
      eq: { is_tenant: true },
    });
    if (!data) return null;
    return mapLinkedInProfileRow(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ getTenantLinkedInProfile:", message);
    throw new Error(message);
  }
};
