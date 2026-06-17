-- =============================================================================
-- Projects — portfolio / work history (replaces professional_background.portfolio_github)
-- =============================================================================
-- Apply after crm-postgres-schema.sql on tenant Supabase.
-- =============================================================================

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY,
  business_name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS project_notes (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  body TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_notes_project_id ON project_notes (project_id);

COMMENT ON TABLE projects IS 'Portfolio projects — business context, tools, and narrative for résumé generation.';
COMMENT ON TABLE project_notes IS 'Append-only freeform notes per project (users, focus areas, metrics, etc.).';
