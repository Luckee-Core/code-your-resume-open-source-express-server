-- Expand jobs.status CHECK to allow interview and rejected.
-- Run in Supabase SQL editor if jobs table already exists with the old constraint.

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_status_check;

ALTER TABLE jobs ADD CONSTRAINT jobs_status_check CHECK (
  status IN ('draft', 'applied', 'interview', 'rejected', 'closed', 'archived')
);
