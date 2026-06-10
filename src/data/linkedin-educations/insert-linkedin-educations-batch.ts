import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { LinkedInEducationInsert } from "../../utils/linkedin-profile";
import type { LinkedInEducation } from "./types";
import { listLinkedInEducationsByProfileId } from "./list-linkedin-educations-by-profile-id";

/**
 * Inserts LinkedIn education rows for one profile.
 */
export const insertLinkedInEducationsBatch = async (
  supabase: SupabaseClient,
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

  const { error } = await supabase.from("linkedin_educations").insert(payload);

  if (error) {
    console.error("❌ insertLinkedInEducationsBatch:", error.message);
    throw new Error(error.message);
  }

  return listLinkedInEducationsByProfileId(supabase, profileId);
};
