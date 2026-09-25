import type { Pool } from "pg";
import { selectRowsFrom } from "../../utils/postgres";
import {
  LINKEDIN_CERTIFICATION_SELECT_COLUMNS,
  type LinkedInCertification,
  type LinkedInCertificationRow,
} from "./types";
import { mapLinkedInCertificationRow } from "./map-linkedin-certification-row";

/**
 * Lists LinkedIn certification rows for one profile.
 */
export const listLinkedInCertificationsByProfileId = async (
  pool: Pool,
  profileId: string,
): Promise<LinkedInCertification[]> => {
  try {
    const data = await selectRowsFrom<LinkedInCertificationRow>(pool, "linkedin_certifications", {
      columns: LINKEDIN_CERTIFICATION_SELECT_COLUMNS,
      eq: { linkedin_profile_id: profileId },
      order: [{ column: "sort_order", ascending: true }],
    });
    return data.map((row) => mapLinkedInCertificationRow(row));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ listLinkedInCertificationsByProfileId:", message);
    throw new Error(message);
  }
};
