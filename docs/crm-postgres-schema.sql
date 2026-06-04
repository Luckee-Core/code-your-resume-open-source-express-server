-- =============================================================================
-- Code Your Resume CRM — full PostgreSQL mirror (optional)
-- =============================================================================
-- Runtime: Express reads/writes CRM core tables in Supabase (service role).
-- Job listing scrape ledger may still use JSON under JOB_LISTING_DATA_DIR until fully mirrored.
-- This file is the canonical DDL for your tenant project.
--
-- JSON on disk → tables (filenames in parentheses):
--   companies.json              → companies
--   employees.json              → employees
--   jobs.json                     → jobs
--   job-applications.json        → job_applications
--   job-listing-scrape-runs.json → job_listing_scrape_runs
--   job_listing_ai_requests / job_listing_ai_responses / job_listing_ai_exchanges: runtime inserts
--   from Express import-listing (Supabase only; no JSON mirror files for the AI ledger).
--   job_responsibilities / job_requirements / job_nice_to_have: optional mirror from the
--   Anthropic sections pass (same exchange as job_listing_ai_exchanges); not separate JSON files.
--
-- Optional Supabase-only DDL without FKs (sidecar mirror): see
-- docs/supabase-job-listing-sections-mirror.sql
--
-- TypeScript field names use camelCase; columns here use snake_case to match
-- typical Postgres conventions.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Core CRM
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  website_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  playwright_website_url_discovery_attempted BOOLEAN NOT NULL DEFAULT false,
  website_research_summary TEXT NOT NULL DEFAULT '',
  website_research_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  linkedin_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'applied', 'interview', 'rejected', 'closed', 'archived')
  ),
  description TEXT NOT NULL DEFAULT '',
  listing_imported_at TIMESTAMPTZ,
  -- Denormalized pointers into job_listing_* (same UUID strings as JSON ledger)
  latest_scrape_run_id UUID,
  latest_ai_exchange_id UUID,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

-- Graphics Studio (runtime: Supabase only — see docs/supabase-image-graphics-schema.sql)
CREATE TABLE IF NOT EXISTS image_graphics (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled graphic',
  canvas_width_px INTEGER NOT NULL DEFAULT 960,
  canvas_height_px INTEGER NOT NULL DEFAULT 540,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ NOT NULL,
  image_graphic_id UUID NOT NULL REFERENCES image_graphics (id) ON DELETE RESTRICT,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS job_questions (
  id UUID PRIMARY KEY,
  prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS job_question_answers (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  job_question_id UUID NOT NULL REFERENCES job_questions (id) ON DELETE RESTRICT,
  answer TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  UNIQUE (job_id, job_question_id)
);

CREATE TABLE IF NOT EXISTS employments (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

-- ---------------------------------------------------------------------------
-- Job listing import: HTTP scrape ledger (see src/data/job-listing/types.ts)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS job_listing_scrape_runs (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  http_status INTEGER,
  plain_text TEXT NOT NULL DEFAULT '',
  error TEXT NOT NULL DEFAULT '',
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS job_listing_ai_requests (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  scrape_run_id UUID REFERENCES job_listing_scrape_runs (id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  user_message TEXT NOT NULL,
  request_payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS job_listing_ai_responses (
  id UUID PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES job_listing_ai_requests (id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error')),
  raw_response TEXT NOT NULL DEFAULT '',
  parsed_response_json JSONB,
  error_message TEXT NOT NULL DEFAULT '',
  usage_input_tokens INTEGER,
  usage_output_tokens INTEGER,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS job_listing_ai_exchanges (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  scrape_run_id UUID REFERENCES job_listing_scrape_runs (id) ON DELETE SET NULL,
  request_id UUID NOT NULL REFERENCES job_listing_ai_requests (id) ON DELETE CASCADE,
  response_id UUID NOT NULL REFERENCES job_listing_ai_responses (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL
);

-- Second-pass structured bullets (Anthropic sections exchange + scrape run).
CREATE TABLE IF NOT EXISTS job_responsibilities (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  scrape_run_id UUID NOT NULL REFERENCES job_listing_scrape_runs (id) ON DELETE CASCADE,
  exchange_id UUID NOT NULL REFERENCES job_listing_ai_exchanges (id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS job_requirements (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  scrape_run_id UUID NOT NULL REFERENCES job_listing_scrape_runs (id) ON DELETE CASCADE,
  exchange_id UUID NOT NULL REFERENCES job_listing_ai_exchanges (id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS job_nice_to_have (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs (id) ON DELETE CASCADE,
  scrape_run_id UUID NOT NULL REFERENCES job_listing_scrape_runs (id) ON DELETE CASCADE,
  exchange_id UUID NOT NULL REFERENCES job_listing_ai_exchanges (id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL
);

-- Optional: enforce pointers on jobs once ledger rows exist (run after backfill).
-- ALTER TABLE jobs
--   ADD CONSTRAINT fk_jobs_latest_scrape_run
--   FOREIGN KEY (latest_scrape_run_id) REFERENCES job_listing_scrape_runs (id) ON DELETE SET NULL;
-- ALTER TABLE jobs
--   ADD CONSTRAINT fk_jobs_latest_ai_exchange
--   FOREIGN KEY (latest_ai_exchange_id) REFERENCES job_listing_ai_exchanges (id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_employees_company_id ON employees (company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs (company_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications (job_id);

CREATE INDEX IF NOT EXISTS idx_job_listing_scrape_runs_job_id ON job_listing_scrape_runs (job_id);
CREATE INDEX IF NOT EXISTS idx_job_listing_scrape_runs_status ON job_listing_scrape_runs (status);

CREATE INDEX IF NOT EXISTS idx_job_listing_ai_requests_job_id ON job_listing_ai_requests (job_id);
CREATE INDEX IF NOT EXISTS idx_job_listing_ai_requests_scrape_run_id ON job_listing_ai_requests (scrape_run_id);

CREATE INDEX IF NOT EXISTS idx_job_listing_ai_responses_request_id ON job_listing_ai_responses (request_id);
CREATE INDEX IF NOT EXISTS idx_job_listing_ai_responses_status ON job_listing_ai_responses (status);

CREATE INDEX IF NOT EXISTS idx_job_listing_ai_exchanges_job_id ON job_listing_ai_exchanges (job_id);
CREATE INDEX IF NOT EXISTS idx_job_listing_ai_exchanges_request_id ON job_listing_ai_exchanges (request_id);
CREATE INDEX IF NOT EXISTS idx_job_listing_ai_exchanges_response_id ON job_listing_ai_exchanges (response_id);

CREATE INDEX IF NOT EXISTS idx_job_responsibilities_job_id ON job_responsibilities (job_id);
CREATE INDEX IF NOT EXISTS idx_job_responsibilities_scrape_run_id ON job_responsibilities (scrape_run_id);
CREATE INDEX IF NOT EXISTS idx_job_responsibilities_exchange_id ON job_responsibilities (exchange_id);

CREATE INDEX IF NOT EXISTS idx_job_requirements_job_id ON job_requirements (job_id);
CREATE INDEX IF NOT EXISTS idx_job_requirements_scrape_run_id ON job_requirements (scrape_run_id);
CREATE INDEX IF NOT EXISTS idx_job_requirements_exchange_id ON job_requirements (exchange_id);

CREATE INDEX IF NOT EXISTS idx_job_nice_to_have_job_id ON job_nice_to_have (job_id);
CREATE INDEX IF NOT EXISTS idx_job_nice_to_have_scrape_run_id ON job_nice_to_have (scrape_run_id);
CREATE INDEX IF NOT EXISTS idx_job_nice_to_have_exchange_id ON job_nice_to_have (exchange_id);
