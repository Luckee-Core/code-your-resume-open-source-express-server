-- =============================================================================
-- Job Studio — Supabase DDL (coach chat ledger per job)
-- =============================================================================
-- Distinct from job_listing_ai_* (listing import). Run in SQL editor when
-- Express should persist Job Studio conversations.
-- =============================================================================

CREATE TABLE IF NOT EXISTS job_studio_requests (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      UUID        NOT NULL,
  user_id     TEXT        NOT NULL DEFAULT 'local-user',
  content     TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed')),
  exchange_id UUID,
  response_id UUID,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_studio_responses (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  structured JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_studio_exchanges (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id           UUID        NOT NULL,
  request_id       UUID        NOT NULL REFERENCES job_studio_requests (id) ON DELETE CASCADE,
  response_id      UUID        REFERENCES job_studio_responses (id) ON DELETE SET NULL,
  input_tokens     INTEGER     NOT NULL DEFAULT 0,
  output_tokens    INTEGER     NOT NULL DEFAULT 0,
  total_tokens     INTEGER     NOT NULL DEFAULT 0,
  credits_used     INTEGER     NOT NULL DEFAULT 0,
  model_used       TEXT        NOT NULL DEFAULT '',
  status           TEXT        NOT NULL DEFAULT 'completed'
    CHECK (status IN ('completed', 'failed')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE job_studio_requests
  ADD CONSTRAINT fk_jsr_exchange
  FOREIGN KEY (exchange_id) REFERENCES job_studio_exchanges (id) ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE job_studio_requests
  ADD CONSTRAINT fk_jsr_response
  FOREIGN KEY (response_id) REFERENCES job_studio_responses (id) ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

CREATE INDEX IF NOT EXISTS idx_job_studio_requests_job_id ON job_studio_requests (job_id);
CREATE INDEX IF NOT EXISTS idx_job_studio_exchanges_job_id ON job_studio_exchanges (job_id);
CREATE INDEX IF NOT EXISTS idx_job_studio_exchanges_created_at ON job_studio_exchanges (created_at);
