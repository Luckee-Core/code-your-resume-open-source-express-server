-- Professional Background Studio — single-tenant narrative segments (education, bio, voice, portfolio).
-- Run in the same Supabase project as technical_skills / Cursor generation ledgers.

CREATE TABLE IF NOT EXISTS professional_background (
  id TEXT PRIMARY KEY DEFAULT 'default' CHECK (id = 'default'),
  segments JSONB NOT NULL DEFAULT '{}'::JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE professional_background IS 'Single row: long-form resume background text segments for Code Your Resume open-source app.';
