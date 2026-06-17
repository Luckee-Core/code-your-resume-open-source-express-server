-- Voice Style Studio — singleton tone/voice notes for AI generation.
-- Run in the same Supabase project as projects / technical_skills.

CREATE TABLE IF NOT EXISTS voice_style (
  id TEXT PRIMARY KEY DEFAULT 'default' CHECK (id = 'default'),
  body TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE voice_style IS 'Single row: candidate voice/tone notes for cover letter and application generation.';
