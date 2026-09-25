-- =============================================================================
-- Technical Skills Studio — Supabase DDL
-- =============================================================================
-- Run this in your Supabase SQL editor to create all tables required by the
-- technical skills studio feature.
--
-- Tables created:
--   technical_skills_requests    → user chat messages sent to the AI coach
--   technical_skills_responses   → raw AI coach responses
--   technical_skills_exchanges   → link table (request + response + token usage)
--   technical_skills             → canonical skill rows
--   technical_skills_suggestions → AI-proposed edits (pending/accepted/rejected)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Studio chat: requests (user messages)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS technical_skills_requests (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  content     TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed')),
  exchange_id UUID,
  response_id UUID,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Studio chat: AI responses
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS technical_skills_responses (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  structured JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Studio chat: exchange (links request + response + token/credit ledger)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS technical_skills_exchanges (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id       UUID        NOT NULL REFERENCES technical_skills_requests (id) ON DELETE CASCADE,
  response_id      UUID        REFERENCES technical_skills_responses (id) ON DELETE SET NULL,
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

-- Back-fill FK references on requests once exchanges exist
ALTER TABLE technical_skills_requests
  ADD CONSTRAINT fk_tsr_exchange
  FOREIGN KEY (exchange_id) REFERENCES technical_skills_exchanges (id) ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE technical_skills_requests
  ADD CONSTRAINT fk_tsr_response
  FOREIGN KEY (response_id) REFERENCES technical_skills_responses (id) ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

-- ---------------------------------------------------------------------------
-- Technical skills (canonical rows)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS technical_skills (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order         INTEGER     NOT NULL DEFAULT 0,
  title              TEXT        NOT NULL,
  body               TEXT,
  status             TEXT        NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'archived')),
  source_exchange_id UUID        REFERENCES technical_skills_exchanges (id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Technical skill suggestions (AI-proposed edits awaiting user acceptance)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS technical_skills_suggestions (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  exchange_id    UUID        NOT NULL REFERENCES technical_skills_exchanges (id) ON DELETE CASCADE,
  response_id    UUID        NOT NULL REFERENCES technical_skills_responses (id) ON DELETE CASCADE,
  title          TEXT        NOT NULL,
  body           TEXT,
  op             TEXT        NOT NULL CHECK (op IN ('add', 'update')),
  target_skill_id UUID       REFERENCES technical_skills (id) ON DELETE SET NULL,
  status         TEXT        NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_ts_sort_order
  ON technical_skills (sort_order);

CREATE INDEX IF NOT EXISTS idx_tsr_status
  ON technical_skills_requests (status);

CREATE INDEX IF NOT EXISTS idx_tse_request_id
  ON technical_skills_exchanges (request_id);

CREATE INDEX IF NOT EXISTS idx_tss_response_id
  ON technical_skills_suggestions (response_id);

CREATE INDEX IF NOT EXISTS idx_tss_status
  ON technical_skills_suggestions (status);
