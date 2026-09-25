import type { Pool } from "pg";
import { selectRowsFrom } from "../../utils/postgres";
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
  pool: Pool,
  profileId: string,
): Promise<LinkedInEmployment[]> => {
  try {
    const data = await selectRowsFrom<LinkedInEmploymentRow>(pool, "linkedin_employments", {
      columns: LINKEDIN_EMPLOYMENT_SELECT_COLUMNS,
      eq: { linkedin_profile_id: profileId },
      order: [{ column: "sort_order", ascending: true }],
    });
    return data.map((row) => mapLinkedInEmploymentRow(row));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ listLinkedInEmploymentsByProfileId:", message);
    throw new Error(message);
  }
};
