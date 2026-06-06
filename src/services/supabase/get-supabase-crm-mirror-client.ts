import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null | undefined;

/**
 * Express-only Supabase client (service role).
 * REST queries only (`.from().select()` etc.) — no Realtime subscriptions in this app.
 *
 * Returns `null` when `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is unset.
 */
export const getSupabaseCrmMirrorClient = (): SupabaseClient | null => {
  if (cached !== undefined) {
    return cached;
  }
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    cached = null;
    return null;
  }
  cached = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return cached;
};
