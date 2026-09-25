import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import { insertRows } from "../../utils/postgres";
import type { LinkedInEmploymentInsert } from "../../utils/linkedin-profile";
import type { LinkedInEmployment } from "./types";
import { listLinkedInEmploymentsByProfileId } from "./list-linkedin-employments-by-profile-id";

/**
 * Inserts LinkedIn employment rows for one profile.
 */
export const insertLinkedInEmploymentsBatch = async (
  pool: Pool,
  profileId: string,
  rows: LinkedInEmploymentInsert[],
): Promise<LinkedInEmployment[]> => {
  if (rows.length === 0) return [];

  const now = new Date().toISOString();
  const payload = rows.map((row) => ({
    id: randomUUID(),
    linkedin_profile_id: profileId,
    sort_order: row.sortOrder,
    position: row.position,
    company_name: row.companyName,
    location: row.location,
    employment_type: row.employmentType,
    workplace_type: row.workplaceType,
    description: row.description,
    duration: row.duration,
    company_linkedin_url: row.companyLinkedinUrl,
    start_month: row.startMonth,
    start_year: row.startYear,
    end_month: row.endMonth,
    end_year: row.endYear,
    is_current: row.isCurrent,
    created_at: now,
    updated_at: now,
  }));

  try {
    await insertRows(pool, "linkedin_employments", payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ insertLinkedInEmploymentsBatch:", message);
    throw new Error(message);
  }

  return listLinkedInEmploymentsByProfileId(pool, profileId);
};
