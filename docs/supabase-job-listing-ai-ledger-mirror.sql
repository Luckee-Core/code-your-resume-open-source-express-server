-- =============================================================================
-- Supabase mirror: job listing AI ledger (optional)
-- =============================================================================
-- Run in the Supabase SQL editor when Express should dual-write AI request /
-- response / exchange rows alongside `job-listing-ai-*.json`.
-- Requires `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` on the CRM server.
--
-- Standalone tables (no FKs to `jobs`) so they work while CRM jobs live in JSON.
-- =============================================================================

CREATE TABLE IF NOT EXISTS job_listing_ai_requests (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL,
  scrape_run_id UUID,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  user_message TEXT NOT NULL,
  request_payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS job_listing_ai_responses (
  id UUID PRIMARY KEY,
  request_id UUID NOT NULL,
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
  job_id UUID NOT NULL,
  scrape_run_id UUID,
  request_id UUID NOT NULL,
  response_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_job_listing_ai_requests_job_id ON job_listing_ai_requests (job_id);
CREATE INDEX IF NOT EXISTS idx_job_listing_ai_requests_scrape_run_id ON job_listing_ai_requests (scrape_run_id);
CREATE INDEX IF NOT EXISTS idx_job_listing_ai_responses_request_id ON job_listing_ai_responses (request_id);
CREATE INDEX IF NOT EXISTS idx_job_listing_ai_exchanges_job_id ON job_listing_ai_exchanges (job_id);
