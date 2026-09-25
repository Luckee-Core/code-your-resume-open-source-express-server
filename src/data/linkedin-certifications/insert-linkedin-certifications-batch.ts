import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import { insertRows } from "../../utils/postgres";
import type { LinkedInCertificationInsert } from "../../utils/linkedin-profile";
import type { LinkedInCertification } from "./types";
import { listLinkedInCertificationsByProfileId } from "./list-linkedin-certifications-by-profile-id";

/**
 * Inserts LinkedIn certification rows for one profile.
 */
export const insertLinkedInCertificationsBatch = async (
  pool: Pool,
  profileId: string,
  rows: LinkedInCertificationInsert[],
): Promise<LinkedInCertification[]> => {
  if (rows.length === 0) return [];

  const now = new Date().toISOString();
  const payload = rows.map((row) => ({
    id: randomUUID(),
    linkedin_profile_id: profileId,
    sort_order: row.sortOrder,
    title: row.title,
    issued_at: row.issuedAt,
    issued_by: row.issuedBy,
    issued_by_link: row.issuedByLink,
    created_at: now,
    updated_at: now,
  }));

  try {
    await insertRows(pool, "linkedin_certifications", payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ insertLinkedInCertificationsBatch:", message);
    throw new Error(message);
  }

  return listLinkedInCertificationsByProfileId(pool, profileId);
};
