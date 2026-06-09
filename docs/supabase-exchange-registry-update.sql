-- =============================================================================
-- Exchange registry update + Cursor generation ledger split
-- =============================================================================
-- Splits shared resume_tsx_code_generation_* into flow-specific ledgers and
-- registers all previously-untracked exchange sources for AI cost aggregation.
-- Run after supabase-crm-ai-prompts-migration.sql (exchange_table_registry exists).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Helper: create one Cursor TSX generation ledger (requests / responses / exchanges)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION _create_cursor_generation_ledger(prefix text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE format($ddl$
    CREATE TABLE IF NOT EXISTS %1$s_requests (
      id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      job_id           UUID        NOT NULL,
      skills           TEXT[]      NOT NULL DEFAULT '{}',
      canvas_width_px  INTEGER     NOT NULL,
      canvas_height_px INTEGER     NOT NULL,
      prompt_text      TEXT        NOT NULL,
      status           TEXT        NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'completed', 'failed')),
      created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS %1$s_responses (
      id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      tsx_code      TEXT        NOT NULL,
      agent_summary TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS %1$s_exchanges (
      id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      job_id            UUID        NOT NULL,
      request_id        UUID        NOT NULL REFERENCES %1$s_requests (id) ON DELETE CASCADE,
      agent_id          TEXT        NOT NULL,
      response_id       UUID        REFERENCES %1$s_responses (id) ON DELETE SET NULL,
      input_tokens      INTEGER     NOT NULL DEFAULT 0,
      output_tokens     INTEGER     NOT NULL DEFAULT 0,
      model_used        TEXT        NOT NULL DEFAULT '',
      status            TEXT        NOT NULL DEFAULT 'running'
        CHECK (status IN ('running', 'completed', 'failed')),
      error_message     TEXT,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_%1$s_requests_job_id
      ON %1$s_requests (job_id);
    CREATE INDEX IF NOT EXISTS idx_%1$s_exchanges_job_id
      ON %1$s_exchanges (job_id);
    CREATE INDEX IF NOT EXISTS idx_%1$s_exchanges_created_at
      ON %1$s_exchanges (created_at DESC);
  $ddl$, prefix);
END;
$$;

SELECT _create_cursor_generation_ledger('cover_letter_generation');
SELECT _create_cursor_generation_ledger('company_interest_generation');
SELECT _create_cursor_generation_ledger('skills_component_generation');

DROP FUNCTION IF EXISTS _create_cursor_generation_ledger(text);

-- Align existing Cursor generation exchange tables (if created with cost_estimate columns)
DO $$
DECLARE
  prefix text;
BEGIN
  FOREACH prefix IN ARRAY ARRAY[
    'cover_letter_generation',
    'company_interest_generation',
    'skills_component_generation'
  ]
  LOOP
    EXECUTE format(
      'ALTER TABLE %I_exchanges ADD COLUMN IF NOT EXISTS input_tokens INTEGER NOT NULL DEFAULT 0',
      prefix
    );
    EXECUTE format(
      'ALTER TABLE %I_exchanges ADD COLUMN IF NOT EXISTS output_tokens INTEGER NOT NULL DEFAULT 0',
      prefix
    );
    EXECUTE format(
      'ALTER TABLE %I_exchanges ADD COLUMN IF NOT EXISTS model_used TEXT NOT NULL DEFAULT ''''',
      prefix
    );
  END LOOP;
END;
$$;

-- ---------------------------------------------------------------------------
-- Backfill from legacy resume_tsx_code_generation_* (when tables exist)
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  legacy_exists boolean;
  nil_job_id    UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'resume_tsx_code_generation_exchanges'
  ) INTO legacy_exists;

  IF NOT legacy_exists THEN
    RAISE NOTICE 'Legacy resume_tsx_code_generation_* not found — skipping backfill';
    RETURN;
  END IF;

  -- Responses (dedupe by id across flows)
  INSERT INTO cover_letter_generation_responses (id, tsx_code, agent_summary, created_at)
  SELECT r.id, r.tsx_code, r.agent_summary, COALESCE(r.created_at, now())
  FROM resume_tsx_code_generation_responses r
  INNER JOIN resume_tsx_code_generation_exchanges e ON e.response_id = r.id
  INNER JOIN resume_tsx_code_generation_requests req ON req.id = e.request_id
  WHERE COALESCE(r.tsx_code, '') ILIKE '%GeneratedCoverLetterPreview%'
     OR COALESCE(req.prompt_text, '') ILIKE '%GeneratedCoverLetterPreview%'
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO company_interest_generation_responses (id, tsx_code, agent_summary, created_at)
  SELECT r.id, r.tsx_code, r.agent_summary, COALESCE(r.created_at, now())
  FROM resume_tsx_code_generation_responses r
  INNER JOIN resume_tsx_code_generation_exchanges e ON e.response_id = r.id
  INNER JOIN resume_tsx_code_generation_requests req ON req.id = e.request_id
  WHERE COALESCE(r.tsx_code, '') ILIKE '%GeneratedCompanyInterestPreview%'
     OR COALESCE(req.prompt_text, '') ILIKE '%GeneratedCompanyInterestPreview%'
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO skills_component_generation_responses (id, tsx_code, agent_summary, created_at)
  SELECT r.id, r.tsx_code, r.agent_summary, COALESCE(r.created_at, now())
  FROM resume_tsx_code_generation_responses r
  INNER JOIN resume_tsx_code_generation_exchanges e ON e.response_id = r.id
  INNER JOIN resume_tsx_code_generation_requests req ON req.id = e.request_id
  WHERE NOT (
    COALESCE(r.tsx_code, '') ILIKE '%GeneratedCoverLetterPreview%'
    OR COALESCE(req.prompt_text, '') ILIKE '%GeneratedCoverLetterPreview%'
    OR COALESCE(r.tsx_code, '') ILIKE '%GeneratedCompanyInterestPreview%'
    OR COALESCE(req.prompt_text, '') ILIKE '%GeneratedCompanyInterestPreview%'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Requests
  INSERT INTO cover_letter_generation_requests (
    id, job_id, skills, canvas_width_px, canvas_height_px, prompt_text, status, created_at, updated_at
  )
  SELECT
    req.id,
    COALESCE(
      (substring(req.prompt_text FROM '\(([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\)'))::uuid,
      nil_job_id
    ),
    COALESCE(req.skills, '{}'),
    req.canvas_width_px,
    req.canvas_height_px,
    req.prompt_text,
    req.status,
    COALESCE(req.created_at, now()),
    COALESCE(req.updated_at, now())
  FROM resume_tsx_code_generation_requests req
  WHERE EXISTS (
    SELECT 1 FROM resume_tsx_code_generation_exchanges e
    LEFT JOIN resume_tsx_code_generation_responses r ON r.id = e.response_id
    WHERE e.request_id = req.id
      AND (
        COALESCE(r.tsx_code, '') ILIKE '%GeneratedCoverLetterPreview%'
        OR COALESCE(req.prompt_text, '') ILIKE '%GeneratedCoverLetterPreview%'
      )
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO company_interest_generation_requests (
    id, job_id, skills, canvas_width_px, canvas_height_px, prompt_text, status, created_at, updated_at
  )
  SELECT
    req.id,
    COALESCE(
      (substring(req.prompt_text FROM '\(([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\)'))::uuid,
      nil_job_id
    ),
    COALESCE(req.skills, '{}'),
    req.canvas_width_px,
    req.canvas_height_px,
    req.prompt_text,
    req.status,
    COALESCE(req.created_at, now()),
    COALESCE(req.updated_at, now())
  FROM resume_tsx_code_generation_requests req
  WHERE EXISTS (
    SELECT 1 FROM resume_tsx_code_generation_exchanges e
    LEFT JOIN resume_tsx_code_generation_responses r ON r.id = e.response_id
    WHERE e.request_id = req.id
      AND (
        COALESCE(r.tsx_code, '') ILIKE '%GeneratedCompanyInterestPreview%'
        OR COALESCE(req.prompt_text, '') ILIKE '%GeneratedCompanyInterestPreview%'
      )
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO skills_component_generation_requests (
    id, job_id, skills, canvas_width_px, canvas_height_px, prompt_text, status, created_at, updated_at
  )
  SELECT
    req.id,
    COALESCE(
      (substring(req.prompt_text FROM '\(([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\)'))::uuid,
      nil_job_id
    ),
    COALESCE(req.skills, '{}'),
    req.canvas_width_px,
    req.canvas_height_px,
    req.prompt_text,
    req.status,
    COALESCE(req.created_at, now()),
    COALESCE(req.updated_at, now())
  FROM resume_tsx_code_generation_requests req
  WHERE EXISTS (
    SELECT 1 FROM resume_tsx_code_generation_exchanges e
    LEFT JOIN resume_tsx_code_generation_responses r ON r.id = e.response_id
    WHERE e.request_id = req.id
      AND NOT (
        COALESCE(r.tsx_code, '') ILIKE '%GeneratedCoverLetterPreview%'
        OR COALESCE(req.prompt_text, '') ILIKE '%GeneratedCoverLetterPreview%'
        OR COALESCE(r.tsx_code, '') ILIKE '%GeneratedCompanyInterestPreview%'
        OR COALESCE(req.prompt_text, '') ILIKE '%GeneratedCompanyInterestPreview%'
      )
  )
  ON CONFLICT (id) DO NOTHING;

  -- Exchanges
  INSERT INTO cover_letter_generation_exchanges (
    id, job_id, request_id, agent_id, response_id,
    input_tokens, output_tokens, model_used, status, error_message,
    created_at, updated_at
  )
  SELECT
    e.id,
    COALESCE(
      (substring(req.prompt_text FROM '\(([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\)'))::uuid,
      nil_job_id
    ),
    e.request_id,
    e.agent_id,
    e.response_id,
    0,
    0,
    '',
    e.status,
    e.error_message,
    COALESCE(e.created_at, now()),
    COALESCE(e.updated_at, now())
  FROM resume_tsx_code_generation_exchanges e
  INNER JOIN resume_tsx_code_generation_requests req ON req.id = e.request_id
  LEFT JOIN resume_tsx_code_generation_responses r ON r.id = e.response_id
  WHERE COALESCE(r.tsx_code, '') ILIKE '%GeneratedCoverLetterPreview%'
     OR COALESCE(req.prompt_text, '') ILIKE '%GeneratedCoverLetterPreview%'
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO company_interest_generation_exchanges (
    id, job_id, request_id, agent_id, response_id,
    input_tokens, output_tokens, model_used, status, error_message,
    created_at, updated_at
  )
  SELECT
    e.id,
    COALESCE(
      (substring(req.prompt_text FROM '\(([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\)'))::uuid,
      nil_job_id
    ),
    e.request_id,
    e.agent_id,
    e.response_id,
    0,
    0,
    '',
    e.status,
    e.error_message,
    COALESCE(e.created_at, now()),
    COALESCE(e.updated_at, now())
  FROM resume_tsx_code_generation_exchanges e
  INNER JOIN resume_tsx_code_generation_requests req ON req.id = e.request_id
  LEFT JOIN resume_tsx_code_generation_responses r ON r.id = e.response_id
  WHERE COALESCE(r.tsx_code, '') ILIKE '%GeneratedCompanyInterestPreview%'
     OR COALESCE(req.prompt_text, '') ILIKE '%GeneratedCompanyInterestPreview%'
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO skills_component_generation_exchanges (
    id, job_id, request_id, agent_id, response_id,
    input_tokens, output_tokens, model_used, status, error_message,
    created_at, updated_at
  )
  SELECT
    e.id,
    COALESCE(
      (substring(req.prompt_text FROM '\(([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\)'))::uuid,
      nil_job_id
    ),
    e.request_id,
    e.agent_id,
    e.response_id,
    0,
    0,
    '',
    e.status,
    e.error_message,
    COALESCE(e.created_at, now()),
    COALESCE(e.updated_at, now())
  FROM resume_tsx_code_generation_exchanges e
  INNER JOIN resume_tsx_code_generation_requests req ON req.id = e.request_id
  LEFT JOIN resume_tsx_code_generation_responses r ON r.id = e.response_id
  WHERE NOT (
    COALESCE(r.tsx_code, '') ILIKE '%GeneratedCoverLetterPreview%'
    OR COALESCE(req.prompt_text, '') ILIKE '%GeneratedCoverLetterPreview%'
    OR COALESCE(r.tsx_code, '') ILIKE '%GeneratedCompanyInterestPreview%'
    OR COALESCE(req.prompt_text, '') ILIKE '%GeneratedCompanyInterestPreview%'
  )
  ON CONFLICT (id) DO NOTHING;

  RAISE NOTICE 'Backfill from resume_tsx_code_generation_* complete';
END;
$$;

-- ---------------------------------------------------------------------------
-- Exchange table registry — register six previously-untracked sources
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
VALUES
  (
    'cover_letter_generation',
    'cover_letter_generation_exchanges',
    'created_at',
    'input_tokens',
    'output_tokens',
    'model_used',
    true,
    30,
    'Cursor cover letter TSX generation'
  ),
  (
    'company_interest_generation',
    'company_interest_generation_exchanges',
    'created_at',
    'input_tokens',
    'output_tokens',
    'model_used',
    true,
    40,
    'Cursor company interest TSX generation'
  ),
  (
    'skills_component_generation',
    'skills_component_generation_exchanges',
    'created_at',
    'input_tokens',
    'output_tokens',
    'model_used',
    true,
    50,
    'Cursor skills/resume TSX generation'
  ),
  (
    'job_studio',
    'job_studio_exchanges',
    'created_at',
    'input_tokens',
    'output_tokens',
    'model_used',
    true,
    60,
    'Job Studio coach chat'
  ),
  (
    'technical_skills',
    'technical_skills_exchanges',
    'created_at',
    'input_tokens',
    'output_tokens',
    'model_used',
    true,
    70,
    'Technical skills coach chat'
  ),
  (
    'user_background_studio',
    'user_background_studio_exchanges',
    'created_at',
    'input_tokens',
    'output_tokens',
    'model_used',
    true,
    80,
    'User background studio coach chat'
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

-- ---------------------------------------------------------------------------
-- Legacy deprecation marker (drop resume_tsx_code_generation_* in follow-up)
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'resume_tsx_code_generation_exchanges'
  ) THEN
    COMMENT ON TABLE resume_tsx_code_generation_exchanges IS
      'deprecated — use flow-specific *_generation_exchanges tables';
    COMMENT ON TABLE resume_tsx_code_generation_requests IS
      'deprecated — use flow-specific *_generation_requests tables';
    COMMENT ON TABLE resume_tsx_code_generation_responses IS
      'deprecated — use flow-specific *_generation_responses tables';
  END IF;
END;
$$;
