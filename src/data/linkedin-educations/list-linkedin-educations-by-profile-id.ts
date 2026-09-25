import type { Pool } from "pg";
import { selectRowsFrom } from "../../utils/postgres";
import {
  LINKEDIN_EDUCATION_SELECT_COLUMNS,
  type LinkedInEducation,
  type LinkedInEducationRow,
} from "./types";
import { mapLinkedInEducationRow } from "./map-linkedin-education-row";

/**
 * Lists LinkedIn education rows for one profile.
 */
export const listLinkedInEducationsByProfileId = async (
  pool: Pool,
  profileId: string,
): Promise<LinkedInEducation[]> => {
  try {
    const data = await selectRowsFrom<LinkedInEducationRow>(pool, "linkedin_educations", {
      columns: LINKEDIN_EDUCATION_SELECT_COLUMNS,
      eq: { linkedin_profile_id: profileId },
      order: [{ column: "sort_order", ascending: true }],
    });
    return data.map((row) => mapLinkedInEducationRow(row));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ listLinkedInEducationsByProfileId:", message);
    throw new Error(message);
  }
};
