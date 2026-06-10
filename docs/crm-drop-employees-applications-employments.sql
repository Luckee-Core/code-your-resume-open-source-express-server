-- Destructive migration: removes CRM employees, job applications, and work history tables.
-- Run in Supabase SQL editor when ready. This deletes all rows in these tables.
--
-- Order: job_applications first (FK to jobs + image_graphics), then employments and employees.

DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS employments CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
