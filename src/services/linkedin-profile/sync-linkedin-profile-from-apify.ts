import type { SupabaseClient } from "@supabase/supabase-js";
import type { LinkedInCertification } from "../../data/linkedin-certifications";
import {
  deleteLinkedInCertificationsByProfileId,
  insertLinkedInCertificationsBatch,
  listLinkedInCertificationsByProfileId,
} from "../../data/linkedin-certifications";
import type { LinkedInEducation } from "../../data/linkedin-educations";
import {
  deleteLinkedInEducationsByProfileId,
  insertLinkedInEducationsBatch,
  listLinkedInEducationsByProfileId,
} from "../../data/linkedin-educations";
import type { LinkedInEmployment } from "../../data/linkedin-employments";
import {
  deleteLinkedInEmploymentsByProfileId,
  insertLinkedInEmploymentsBatch,
  listLinkedInEmploymentsByProfileId,
} from "../../data/linkedin-employments";
import type { LinkedInProfile } from "../../data/linkedin-profiles";
import {
  getTenantLinkedInProfile,
  updateLinkedInProfile,
} from "../../data/linkedin-profiles";
import { mapApifyProfileToRows } from "../../utils/linkedin-profile";
import { fetchLinkedInProfileFromScraper } from "./fetch-linkedin-profile-from-scraper";

const LOG = "[linkedin-profile:sync-from-apify]";

export type LinkedInProfileBundle = {
  profile: LinkedInProfile;
  employments: LinkedInEmployment[];
  educations: LinkedInEducation[];
  certifications: LinkedInCertification[];
};

/**
 * Scrapes the tenant LinkedIn profile URL and persists normalized rows.
 */
export const syncTenantLinkedInProfileFromApify = async (
  supabase: SupabaseClient,
): Promise<LinkedInProfileBundle | { error: string }> => {
  const tenant = await getTenantLinkedInProfile(supabase);
  if (!tenant) {
    return { error: "Tenant LinkedIn profile is not configured" };
  }

  const linkedinUrl = tenant.linkedinUrl.trim();
  if (!linkedinUrl) {
    return { error: "Tenant LinkedIn profile URL is empty" };
  }

  console.log(`🚀 ${LOG} profileId=${tenant.id}`);

  const scrapeResult = await fetchLinkedInProfileFromScraper(linkedinUrl);
  if ("error" in scrapeResult) {
    return { error: scrapeResult.error };
  }

  const mapped = mapApifyProfileToRows(scrapeResult.item);

  const profile = await updateLinkedInProfile(supabase, tenant.id, {
    publicIdentifier: mapped.profile.publicIdentifier,
    apifyProfileId: mapped.profile.apifyProfileId,
    name: mapped.profile.name,
    headline: mapped.profile.headline,
    location: mapped.profile.location,
    syncedAt: mapped.profile.syncedAt,
  });

  if (!profile) {
    return { error: "Failed to update LinkedIn profile after sync" };
  }

  await deleteLinkedInEmploymentsByProfileId(supabase, profile.id);
  await deleteLinkedInEducationsByProfileId(supabase, profile.id);
  await deleteLinkedInCertificationsByProfileId(supabase, profile.id);

  await insertLinkedInEmploymentsBatch(supabase, profile.id, mapped.employments);
  await insertLinkedInEducationsBatch(supabase, profile.id, mapped.educations);
  await insertLinkedInCertificationsBatch(supabase, profile.id, mapped.certifications);

  const employments = await listLinkedInEmploymentsByProfileId(supabase, profile.id);
  const educations = await listLinkedInEducationsByProfileId(supabase, profile.id);
  const certifications = await listLinkedInCertificationsByProfileId(supabase, profile.id);

  console.log(
    `✅ ${LOG} profileId=${profile.id} employments=${employments.length} educations=${educations.length} certifications=${certifications.length}`,
  );

  return { profile, employments, educations, certifications };
};
