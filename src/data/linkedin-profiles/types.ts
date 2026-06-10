export type LinkedInProfile = {
  id: string;
  isTenant: boolean;
  linkedinUrl: string;
  publicIdentifier: string;
  apifyProfileId: string;
  name: string;
  headline: string;
  location: string;
  syncedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LinkedInProfileRow = {
  id: string;
  is_tenant: boolean;
  linkedin_url: string;
  public_identifier: string;
  apify_profile_id: string;
  name: string;
  headline: string;
  location: string;
  synced_at: string | null;
  created_at: string;
  updated_at: string;
};

export const LINKEDIN_PROFILE_SELECT_COLUMNS =
  "id, is_tenant, linkedin_url, public_identifier, apify_profile_id, name, headline, location, synced_at, created_at, updated_at";
