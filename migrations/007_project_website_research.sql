-- =============================================================================
-- Project website research — AI summary fields on projects
-- =============================================================================
-- Run after docs/supabase-projects-schema.sql on tenant Supabase.
-- =============================================================================

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS website_research_summary TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS website_research_completed_at TIMESTAMPTZ;

COMMENT ON COLUMN projects.website_research_summary IS 'Plain-text summary from website crawl + optional AI (At a glance).';
COMMENT ON COLUMN projects.website_research_completed_at IS 'When website research last completed successfully.';
