import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { LinkedInCertificationInsert } from "../../utils/linkedin-profile";
import type { LinkedInCertification } from "./types";
import { listLinkedInCertificationsByProfileId } from "./list-linkedin-certifications-by-profile-id";

/**
 * Inserts LinkedIn certification rows for one profile.
 */
export const insertLinkedInCertificationsBatch = async (
  supabase: SupabaseClient,
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

  const { error } = await supabase.from("linkedin_certifications").insert(payload);

  if (error) {
    console.error("❌ insertLinkedInCertificationsBatch:", error.message);
    throw new Error(error.message);
  }

  return listLinkedInCertificationsByProfileId(supabase, profileId);
};
