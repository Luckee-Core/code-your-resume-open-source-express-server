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

-- ---------------------------------------------------------------------------
-- crm_ai_flow_prompt — project notes synthesis
-- ---------------------------------------------------------------------------

UPDATE crm_ai_flow_prompt
SET is_active = false
WHERE flow = 'project_notes_synthesis';

INSERT INTO crm_ai_flow_prompt (flow, name, version, system_prompt, is_active)
VALUES (
  'project_notes_synthesis',
  'Project notes synthesis v1',
  1,
  $prompt$You extract resume-ready project notes from pasted narrative text about a software project.

You receive optional project context (business name, description, duration, technologies) plus a large blob of freeform text (README, LinkedIn write-up, résumé bullets, meeting notes, etc.).

Return ONLY valid JSON with this exact shape:
{"notes":["note one","note two"]}

Rules:
- Each note is one concise, standalone fact: metrics, user counts, focus areas, tech choices, outcomes, scope, team size, or business impact.
- Use resume-ready phrasing (past tense for completed work unless ongoing).
- No markdown, bullets, numbering, or prefixes inside note strings.
- Typical output: 3–15 notes. Omit fluff and duplicates.
- If nothing useful can be extracted, return {"notes":[]}.
- Do not invent facts not supported by the input text.$prompt$,
  true
);

-- ---------------------------------------------------------------------------
-- exchange_table_registry
-- ---------------------------------------------------------------------------

INSERT INTO public.exchange_table_registry (
  logical_key,
  table_name,
  occurred_at_column,
  input_tokens_column,
  output_tokens_column,
  model_column,
  enabled,
  sort_order,
  notes
)
VALUES (
  'project_notes_synthesis',
  'project_notes_synthesis_exchanges',
  'created_at',
  'usage_input_tokens',
  'usage_output_tokens',
  'model',
  true,
  25,
  'Project notes synthesis from pasted text; tokens on project_notes_synthesis_responses via custom lister'
)
ON CONFLICT (logical_key) DO UPDATE
SET
  table_name = EXCLUDED.table_name,
  occurred_at_column = EXCLUDED.occurred_at_column,
  input_tokens_column = EXCLUDED.input_tokens_column,
  output_tokens_column = EXCLUDED.output_tokens_column,
  model_column = EXCLUDED.model_column,
  enabled = EXCLUDED.enabled,
  sort_order = EXCLUDED.sort_order,
  notes = EXCLUDED.notes;
