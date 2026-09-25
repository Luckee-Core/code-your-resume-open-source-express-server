-- Typed error tables (no JSONB). Run in the SAME Supabase project as Express SUPABASE_URL.
-- One table per error category; copy this file (or individual CREATE blocks) into new tenant projects.

-- ---------------------------------------------------------------------------
-- thunk_errors — Redux thunk unexpected failures (client-reported)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS thunk_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('fatal', 'error', 'warning')),
  message TEXT NOT NULL,
  stack TEXT,
  thunk_name TEXT,
  collection TEXT,
  entity_id TEXT,
  user_id UUID,
  app_slug TEXT NOT NULL,
  environment TEXT NOT NULL,
  release TEXT
);

CREATE INDEX IF NOT EXISTS thunk_errors_created_at_idx ON thunk_errors (created_at DESC);
CREATE INDEX IF NOT EXISTS thunk_errors_event_idx ON thunk_errors (event);
CREATE INDEX IF NOT EXISTS thunk_errors_entity_id_idx ON thunk_errors (entity_id) WHERE entity_id IS NOT NULL;

COMMENT ON TABLE thunk_errors IS 'Client thunk failures; stable event id per thunk file for grouping.';

-- ---------------------------------------------------------------------------
-- ui_errors — React error boundaries / route errors (scaffold)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ui_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('fatal', 'error', 'warning')),
  message TEXT NOT NULL,
  stack TEXT,
  route_path TEXT NOT NULL,
  component_name TEXT,
  digest TEXT,
  app_slug TEXT NOT NULL,
  environment TEXT NOT NULL,
  release TEXT
);

CREATE INDEX IF NOT EXISTS ui_errors_created_at_idx ON ui_errors (created_at DESC);
CREATE INDEX IF NOT EXISTS ui_errors_event_idx ON ui_errors (event);

COMMENT ON TABLE ui_errors IS 'UI / error-boundary failures.';

-- ---------------------------------------------------------------------------
-- api_errors — HTTP handler / BFF failures (scaffold)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('fatal', 'error', 'warning')),
  message TEXT NOT NULL,
  stack TEXT,
  http_method TEXT NOT NULL,
  route_path TEXT NOT NULL,
  status_code INTEGER,
  upstream TEXT,
  app_slug TEXT NOT NULL,
  environment TEXT NOT NULL,
  release TEXT
);

CREATE INDEX IF NOT EXISTS api_errors_created_at_idx ON api_errors (created_at DESC);
CREATE INDEX IF NOT EXISTS api_errors_event_idx ON api_errors (event);

COMMENT ON TABLE api_errors IS 'API route / handler failures.';
