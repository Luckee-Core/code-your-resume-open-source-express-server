-- =============================================================================
-- LinkedIn profile mirror (Apify harvestapi~linkedin-profile-scraper)
-- =============================================================================
-- Run in Supabase SQL Editor after core CRM tables exist.
-- No JSONB — normalized profile + employment / education / certification rows.
-- Distinct from CRM `employments` (company + job tenure).
-- =============================================================================

CREATE TABLE IF NOT EXISTS linkedin_profiles (
  id UUID PRIMARY KEY,
  is_tenant BOOLEAN NOT NULL DEFAULT false,
  linkedin_url TEXT NOT NULL,
  public_identifier TEXT NOT NULL DEFAULT '',
  apify_profile_id TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  headline TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS linkedin_profiles_one_tenant
  ON linkedin_profiles ((true))
  WHERE is_tenant = true;

CREATE TABLE IF NOT EXISTS linkedin_employments (
  id UUID PRIMARY KEY,
  linkedin_profile_id UUID NOT NULL REFERENCES linkedin_profiles (id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  position TEXT NOT NULL DEFAULT '',
  company_name TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  employment_type TEXT NOT NULL DEFAULT '',
  workplace_type TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  company_linkedin_url TEXT NOT NULL DEFAULT '',
  start_month TEXT NOT NULL DEFAULT '',
  start_year INTEGER,
  end_month TEXT NOT NULL DEFAULT '',
  end_year INTEGER,
  is_current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS linkedin_educations (
  id UUID PRIMARY KEY,
  linkedin_profile_id UUID NOT NULL REFERENCES linkedin_profiles (id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  school_name TEXT NOT NULL DEFAULT '',
  degree TEXT NOT NULL DEFAULT '',
  field_of_study TEXT NOT NULL DEFAULT '',
  period TEXT NOT NULL DEFAULT '',
  school_linkedin_url TEXT NOT NULL DEFAULT '',
  start_year INTEGER,
  end_year INTEGER,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS linkedin_certifications (
  id UUID PRIMARY KEY,
  linkedin_profile_id UUID NOT NULL REFERENCES linkedin_profiles (id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL DEFAULT '',
  issued_at TEXT NOT NULL DEFAULT '',
  issued_by TEXT NOT NULL DEFAULT '',
  issued_by_link TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_linkedin_employments_profile_id
  ON linkedin_employments (linkedin_profile_id);

CREATE INDEX IF NOT EXISTS idx_linkedin_educations_profile_id
  ON linkedin_educations (linkedin_profile_id);

CREATE INDEX IF NOT EXISTS idx_linkedin_certifications_profile_id
  ON linkedin_certifications (linkedin_profile_id);
