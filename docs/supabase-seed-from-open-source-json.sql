-- =============================================================================
-- Supabase seed from local JSON vault
-- Generated: 2026-05-28T15:51:49.119Z
-- CRM dir: .data/crm (relative to express-server repo root)
-- Job listing dir: .data/job-listing
--
-- Prerequisite DDL (run first if tables are missing):
--   docs/crm-postgres-schema.sql
--   docs/supabase-image-graphics-schema.sql
--
-- Regenerate:
--   npx ts-node scripts/generate-supabase-seed-from-json.ts
--
-- Open-source test vault only:
--   CRM_DATA_DIR=../code-your-resume-open-source/.data/crm \
--   JOB_LISTING_DATA_DIR=../code-your-resume-open-source/.data/job-listing \
--   npx ts-node scripts/generate-supabase-seed-from-json.ts
-- =============================================================================

BEGIN;

-- companies (1 rows)
INSERT INTO companies (
  id, name, website, notes, website_urls,
  playwright_website_url_discovery_attempted, website_research_summary,
  website_research_completed_at, created_at, updated_at
)
VALUES
  (
    $seed$bd8daab0-4d3d-45cd-a996-a3b8a0734baf$seed$::uuid,
    $seed$Test Company$seed$,
    $seed$test.com$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-04-30T15:59:55.101Z$seed$::timestamptz,
    $seed$2026-04-30T17:00:57.946Z$seed$::timestamptz
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  notes = EXCLUDED.notes,
  website_urls = EXCLUDED.website_urls,
  playwright_website_url_discovery_attempted = EXCLUDED.playwright_website_url_discovery_attempted,
  website_research_summary = EXCLUDED.website_research_summary,
  website_research_completed_at = EXCLUDED.website_research_completed_at,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at;

-- employees (1 rows)
INSERT INTO employees (
  id, company_id, name, role, email, linkedin_url, created_at, updated_at
)
VALUES
  (
    $seed$4e2f5585-654e-4d97-81ab-38dc978e1930$seed$::uuid,
    $seed$bd8daab0-4d3d-45cd-a996-a3b8a0734baf$seed$::uuid,
    $seed$Temp Employee$seed$,
    $seed$Recruiter$seed$,
    $seed$test@tmail.com$seed$,
    $seed$$seed$,
    $seed$2026-04-30T16:00:03.762Z$seed$::timestamptz,
    $seed$2026-04-30T17:03:04.444Z$seed$::timestamptz
  )
ON CONFLICT (id) DO UPDATE SET
  company_id = EXCLUDED.company_id,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  email = EXCLUDED.email,
  linkedin_url = EXCLUDED.linkedin_url,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at;

-- image_graphics stubs for job_applications FK (1 rows)
INSERT INTO image_graphics (
  id, title, canvas_width_px, canvas_height_px, metadata, created_at, updated_at
)
VALUES
  (
    $seed$454cc7e5-85c3-4e19-a5c4-fb9e8abba85b$seed$::uuid,
    $seed$Seeded graphic stub$seed$,
    960,
    540,
    '{}'::jsonb,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- jobs (1 rows)
INSERT INTO jobs (
  id, company_id, title, url, status, description,
  listing_imported_at, latest_scrape_run_id, latest_ai_exchange_id,
  created_at, updated_at
)
VALUES
  (
    $seed$aa5eec5f-6426-400c-b91e-d235bcdcd15d$seed$::uuid,
    $seed$bd8daab0-4d3d-45cd-a996-a3b8a0734baf$seed$::uuid,
    $seed$Test Job$seed$,
    $seed$$seed$,
    $seed$draft$seed$,
    $seed$$seed$,
    NULL,
    NULL,
    NULL,
    $seed$2026-04-30T16:00:14.908Z$seed$::timestamptz,
    $seed$2026-04-30T16:00:14.908Z$seed$::timestamptz
  )
ON CONFLICT (id) DO UPDATE SET
  company_id = EXCLUDED.company_id,
  title = EXCLUDED.title,
  url = EXCLUDED.url,
  status = EXCLUDED.status,
  description = EXCLUDED.description,
  listing_imported_at = EXCLUDED.listing_imported_at,
  latest_scrape_run_id = EXCLUDED.latest_scrape_run_id,
  latest_ai_exchange_id = EXCLUDED.latest_ai_exchange_id,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at;

-- job_listing_scrape_runs: (no rows in JSON)

-- job_applications (1 rows)
INSERT INTO job_applications (
  id, job_id, submitted_at, image_graphic_id, notes, created_at, updated_at
)
VALUES
  (
    $seed$556d63f5-1d2b-4bb3-8dbd-764067155351$seed$::uuid,
    $seed$aa5eec5f-6426-400c-b91e-d235bcdcd15d$seed$::uuid,
    $seed$2026-04-30T16:49:11.309Z$seed$::timestamptz,
    $seed$454cc7e5-85c3-4e19-a5c4-fb9e8abba85b$seed$::uuid,
    $seed$$seed$,
    $seed$2026-04-30T16:49:11.468Z$seed$::timestamptz,
    $seed$2026-04-30T16:49:11.468Z$seed$::timestamptz
  )
ON CONFLICT (id) DO UPDATE SET
  job_id = EXCLUDED.job_id,
  submitted_at = EXCLUDED.submitted_at,
  image_graphic_id = EXCLUDED.image_graphic_id,
  notes = EXCLUDED.notes,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at;

COMMIT;
