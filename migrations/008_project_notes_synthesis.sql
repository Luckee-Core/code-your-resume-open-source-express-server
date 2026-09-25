-- =============================================================================
-- Project notes synthesis — AI ledger (three-table pattern)
-- =============================================================================
-- Run after docs/supabase-projects-schema.sql on tenant Supabase.
-- =============================================================================

CREATE TABLE IF NOT EXISTS project_notes_synthesis_requests (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  user_message TEXT NOT NULL,
  request_payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS project_notes_synthesis_responses (
  id UUID PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES project_notes_synthesis_requests (id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error')),
  raw_response TEXT NOT NULL DEFAULT '',
  parsed_response_json JSONB,
  error_message TEXT NOT NULL DEFAULT '',
  usage_input_tokens INTEGER,
  usage_output_tokens INTEGER,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS project_notes_synthesis_exchanges (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES project_notes_synthesis_requests (id) ON DELETE CASCADE,
  response_id UUID NOT NULL REFERENCES project_notes_synthesis_responses (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_notes_synthesis_requests_project_id
  ON project_notes_synthesis_requests (project_id);

CREATE INDEX IF NOT EXISTS idx_project_notes_synthesis_responses_request_id
  ON project_notes_synthesis_responses (request_id);

CREATE INDEX IF NOT EXISTS idx_project_notes_synthesis_exchanges_project_id
  ON project_notes_synthesis_exchanges (project_id);

CREATE INDEX IF NOT EXISTS idx_project_notes_synthesis_exchanges_request_id
  ON project_notes_synthesis_exchanges (request_id);

COMMENT ON TABLE project_notes_synthesis_requests IS 'Anthropic request ledger for project notes synthesis.';
COMMENT ON TABLE project_notes_synthesis_responses IS 'Anthropic response ledger for project notes synthesis.';
COMMENT ON TABLE project_notes_synthesis_exchanges IS 'Links project notes synthesis request/response pairs.';
