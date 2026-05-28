-- Graphics Studio rows (TSX drafts in metadata.studioDraft).
-- Run in the SAME Supabase project as Express SUPABASE_URL (Dashboard → SQL → New query → Run).
-- Error "Could not find the table public.image_graphics" means this file was not applied yet.

CREATE TABLE IF NOT EXISTS image_graphics (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled graphic',
  job_id TEXT NOT NULL DEFAULT '',
  canvas_width_px INTEGER NOT NULL DEFAULT 960 CHECK (canvas_width_px >= 64 AND canvas_width_px <= 8192),
  canvas_height_px INTEGER NOT NULL DEFAULT 540 CHECK (canvas_height_px >= 64 AND canvas_height_px <= 8192),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Existing projects: run once if the table predates job_id.
ALTER TABLE image_graphics ADD COLUMN IF NOT EXISTS job_id TEXT NOT NULL DEFAULT '';

-- One-time backfill when job id was stored in metadata.jobId:
-- UPDATE image_graphics
-- SET job_id = TRIM(metadata->>'jobId')
-- WHERE job_id = '' AND metadata ? 'jobId' AND TRIM(metadata->>'jobId') <> '';

CREATE INDEX IF NOT EXISTS image_graphics_updated_at_idx ON image_graphics (updated_at DESC);
CREATE INDEX IF NOT EXISTS image_graphics_job_id_idx ON image_graphics (job_id) WHERE job_id <> '';

COMMENT ON TABLE image_graphics IS 'Graphics Studio layouts; studio TSX lives in metadata->studioDraft->tsx.';
