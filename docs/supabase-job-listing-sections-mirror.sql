-- =============================================================================
-- Supabase mirror: job listing section bullets (optional)
-- =============================================================================
-- Run this in the Supabase SQL editor if you want Express to dual-write section
-- rows when `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set on the CRM server.
--
-- Tables are standalone (no FK to `jobs` or `job_listing_*`) so they work while
-- CRM jobs still live in the local JSON vault. Add FKs later if you migrate jobs.
-- =============================================================================

CREATE TABLE IF NOT EXISTS job_responsibilities (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL,
  scrape_run_id UUID NOT NULL,
  exchange_id UUID NOT NULL,
  body TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS job_requirements (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL,
  scrape_run_id UUID NOT NULL,
  exchange_id UUID NOT NULL,
  body TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS job_nice_to_have (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL,
  scrape_run_id UUID NOT NULL,
  exchange_id UUID NOT NULL,
  body TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_job_responsibilities_job_id ON job_responsibilities (job_id);
CREATE INDEX IF NOT EXISTS idx_job_requirements_job_id ON job_requirements (job_id);
CREATE INDEX IF NOT EXISTS idx_job_nice_to_have_job_id ON job_nice_to_have (job_id);

-- RLS: enable and add policies for your auth model, or restrict DB access to service role only.
-- ALTER TABLE job_responsibilities ENABLE ROW LEVEL SECURITY;
-- …
