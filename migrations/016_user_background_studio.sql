-- =============================================================================
-- User Background Studio — Supabase DDL
-- =============================================================================
-- Run this in your Supabase SQL editor to create all tables required by the
-- user background studio feature (ICP / resume background profiles).
--
-- Tables created:
--   user_background_profiles          → profile records (one per named background)
--   user_background_versions          → version snapshots per profile
--   user_background_version_sections  → section rows per version
--   user_background_studio_requests   → user chat messages sent to the AI coach
--   user_background_studio_responses  → raw AI coach responses
--   user_background_studio_exchanges  → link table (request + response + token usage)
--   user_background_segment_items     → canonical segment items per profile
--   user_background_segment_suggestions → AI-proposed edits (pending/accepted/rejected)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_background_profiles (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT        NOT NULL,
  name         TEXT        NOT NULL,
  description  TEXT,
  current_version INTEGER  NOT NULL DEFAULT 1,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Versions
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_background_versions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID        NOT NULL REFERENCES user_background_profiles (id) ON DELETE CASCADE,
  version     INTEGER     NOT NULL,
  label       TEXT,
  snapshot_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (profile_id, version)
);

-- ---------------------------------------------------------------------------
-- Version sections (one row per section per version snapshot)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_background_version_sections (
  id                 UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_version_id UUID    NOT NULL REFERENCES user_background_versions (id) ON DELETE CASCADE,
  section_key        TEXT    NOT NULL,
  title              TEXT    NOT NULL,
  body               TEXT,
  last_version       TEXT,
  sort_order         INTEGER NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- Studio chat: requests (user messages)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_background_studio_requests (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT        NOT NULL,
  profile_id  UUID        NOT NULL REFERENCES user_background_profiles (id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS user_background_studio_responses (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  structured JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Studio chat: exchange (links request + response + token/credit ledger)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_background_studio_exchanges (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          TEXT        NOT NULL,
  profile_id       UUID        NOT NULL REFERENCES user_background_profiles (id) ON DELETE CASCADE,
  request_id       UUID        NOT NULL REFERENCES user_background_studio_requests (id) ON DELETE CASCADE,
  response_id      UUID        REFERENCES user_background_studio_responses (id) ON DELETE SET NULL,
  input_tokens     INTEGER     NOT NULL DEFAULT 0,
  output_tokens    INTEGER     NOT NULL DEFAULT 0,
  total_tokens     INTEGER     NOT NULL DEFAULT 0,
  credits_used     INTEGER     NOT NULL DEFAULT 0,
  tokens_per_credit INTEGER    NOT NULL DEFAULT 0,
  model_used       TEXT        NOT NULL DEFAULT '',
  status           TEXT        NOT NULL DEFAULT 'completed'
    CHECK (status IN ('completed', 'failed')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Back-fill FK references on requests once exchanges exist
ALTER TABLE user_background_studio_requests
  ADD CONSTRAINT fk_ubsr_exchange
  FOREIGN KEY (exchange_id) REFERENCES user_background_studio_exchanges (id) ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE user_background_studio_requests
  ADD CONSTRAINT fk_ubsr_response
  FOREIGN KEY (response_id) REFERENCES user_background_studio_responses (id) ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

-- ---------------------------------------------------------------------------
-- Segment items (canonical, versioned content blocks per profile)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_background_segment_items (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id         UUID        NOT NULL REFERENCES user_background_profiles (id) ON DELETE CASCADE,
  segment_key        TEXT        NOT NULL,
  sort_order         INTEGER     NOT NULL DEFAULT 0,
  title              TEXT        NOT NULL,
  body               TEXT,
  metadata           JSONB       NOT NULL DEFAULT '{}'::jsonb,
  status             TEXT        NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'archived')),
  source_exchange_id UUID        REFERENCES user_background_studio_exchanges (id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Segment suggestions (AI-proposed edits awaiting user acceptance)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_background_segment_suggestions (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id     UUID        NOT NULL REFERENCES user_background_profiles (id) ON DELETE CASCADE,
  exchange_id    UUID        NOT NULL REFERENCES user_background_studio_exchanges (id) ON DELETE CASCADE,
  response_id    UUID        NOT NULL REFERENCES user_background_studio_responses (id) ON DELETE CASCADE,
  segment_key    TEXT        NOT NULL,
  title          TEXT        NOT NULL,
  body           TEXT,
  op             TEXT        NOT NULL,
  target_item_id UUID        REFERENCES user_background_segment_items (id) ON DELETE SET NULL,
  status         TEXT        NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_ubp_user_id
  ON user_background_profiles (user_id);

CREATE INDEX IF NOT EXISTS idx_ubv_profile_id
  ON user_background_versions (profile_id);

CREATE INDEX IF NOT EXISTS idx_ubvs_profile_version_id
  ON user_background_version_sections (profile_version_id);

CREATE INDEX IF NOT EXISTS idx_ubsr_profile_id
  ON user_background_studio_requests (profile_id);

CREATE INDEX IF NOT EXISTS idx_ubsr_user_id
  ON user_background_studio_requests (user_id);

CREATE INDEX IF NOT EXISTS idx_ubse_profile_id
  ON user_background_studio_exchanges (profile_id);

CREATE INDEX IF NOT EXISTS idx_ubse_user_id
  ON user_background_studio_exchanges (user_id);

CREATE INDEX IF NOT EXISTS idx_ubsi_profile_id
  ON user_background_segment_items (profile_id);

CREATE INDEX IF NOT EXISTS idx_ubsi_segment_key
  ON user_background_segment_items (profile_id, segment_key);

CREATE INDEX IF NOT EXISTS idx_ubss_profile_id
  ON user_background_segment_suggestions (profile_id);

CREATE INDEX IF NOT EXISTS idx_ubss_response_id
  ON user_background_segment_suggestions (response_id);
