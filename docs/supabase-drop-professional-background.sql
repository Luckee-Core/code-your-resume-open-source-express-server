-- Remove professional_background after migrating voice_style (optional one-time copy below).
-- Run AFTER docs/supabase-voice-style-schema.sql and optional migration.

-- Optional: preserve voice_style text from legacy table
-- INSERT INTO voice_style (body, updated_at)
-- SELECT COALESCE(segments->>'voice_style', ''), updated_at
-- FROM professional_background
-- WHERE id = 'default'
-- ON CONFLICT (id) DO UPDATE
-- SET body = EXCLUDED.body, updated_at = EXCLUDED.updated_at;

DROP TABLE IF EXISTS professional_background;
