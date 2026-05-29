import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseCrmMirrorClient } from "../../services/supabase/get-supabase-crm-mirror-client";

/**
 * Returns the CRM Supabase client. CRM data always lives in Supabase — not JSON files.
 */
export const requireCrmSupabaseClient = (): SupabaseClient => {
  const client = getSupabaseCrmMirrorClient();
  if (!client) {
    throw new Error(
      "Supabase is required for CRM: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the Express server.",
    );
  }
  return client;
};
