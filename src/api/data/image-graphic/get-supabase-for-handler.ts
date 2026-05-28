import type { Response } from "express";
import { getSupabaseCrmMirrorClient } from "../../../services/supabase/get-supabase-crm-mirror-client";
import type { SupabaseClient } from "@supabase/supabase-js";

const NOT_CONFIGURED =
  "Supabase not configured on Express. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in code-your-resume-open-source-express-server/.env";

/**
 * Returns the Express Supabase client or sends 500 and returns null.
 */
export const getSupabaseForImageGraphicHandler = (res: Response): SupabaseClient | null => {
  const supabase = getSupabaseCrmMirrorClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: NOT_CONFIGURED });
    return null;
  }
  return supabase;
};
