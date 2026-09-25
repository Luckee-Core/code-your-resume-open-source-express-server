import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import { insertRows } from "../../utils/postgres";
import type { LinkedInEducationInsert } from "../../utils/linkedin-profile";
import type { LinkedInEducation } from "./types";
import { listLinkedInEducationsByProfileId } from "./list-linkedin-educations-by-profile-id";

/**
 * Inserts LinkedIn education rows for one profile.
 */
export const insertLinkedInEducationsBatch = async (
  pool: Pool,
  profileId: string,
  rows: LinkedInEducationInsert[],
): Promise<LinkedInEducation[]> => {
  if (rows.length === 0) return [];

  const now = new Date().toISOString();
  const payload = rows.map((row) => ({
    id: randomUUID(),
    linkedin_profile_id: profileId,
    sort_order: row.sortOrder,
    school_name: row.schoolName,
    degree: row.degree,
    field_of_study: row.fieldOfStudy,
    period: row.period,
    school_linkedin_url: row.schoolLinkedinUrl,
    start_year: row.startYear,
    end_year: row.endYear,
    created_at: now,
    updated_at: now,
  }));

  try {
    await insertRows(pool, "linkedin_educations", payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ insertLinkedInEducationsBatch:", message);
    throw new Error(message);
  }

  return listLinkedInEducationsByProfileId(pool, profileId);
};
