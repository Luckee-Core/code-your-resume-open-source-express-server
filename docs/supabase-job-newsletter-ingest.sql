-- =============================================================================
-- Code Your Resume — job newsletter email ingest
-- =============================================================================
-- Prerequisite: run docs/crm-postgres-schema.sql first (companies + jobs tables).
-- Forwarded emails from email-manager are matched to job_newsletter_sources by
-- sender_email; Anthropic parses job postings using parse_instructions per row.
--
-- Run in your code-your-resume Supabase project SQL editor.

CREATE TABLE IF NOT EXISTS job_newsletter_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sender_email text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  parse_instructions text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_job_newsletter_sources_sender_email
  ON job_newsletter_sources (lower(trim(sender_email)));

-- Dedupe job creates by posting URL
CREATE UNIQUE INDEX IF NOT EXISTS idx_jobs_url_unique_nonempty
  ON jobs (url)
  WHERE url <> '';

-- Faster company lookup by normalized name
CREATE INDEX IF NOT EXISTS idx_companies_name_lower
  ON companies (lower(trim(name)));

-- Example: Matcha daily digest (adjust sender_email if needed)
-- INSERT INTO job_newsletter_sources (name, sender_email, parse_instructions)
-- VALUES (
--   'Matcha daily job digest',
--   'fico@matcha.fm',
--   'This is a daily newsletter of remote job postings. Each job is a hyperlink whose link text looks like "{Job Title} at {Company Name} - ${salary}". The paragraph immediately after each link is the job description. A line like "Posted today - team of N" is metadata, not part of the description. Extract every job posting with title, companyName, url (from the hyperlink href), description, and optional salary from the link text.'
-- );
