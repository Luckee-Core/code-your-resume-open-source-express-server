import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Clears `is_tenant` on all LinkedIn profiles except the optional keep id.
 */
export const clearOtherTenantLinkedInProfileFlags = async (
  supabase: SupabaseClient,
  keepId?: string,
): Promise<void> => {
  let query = supabase.from("linkedin_profiles").update({ is_tenant: false }).eq("is_tenant", true);

  if (keepId) {
    query = query.neq("id", keepId);
  }

  const { error } = await query;

  if (error) {
    console.error("❌ clearOtherTenantLinkedInProfileFlags:", error.message);
    throw new Error(error.message);
  }
};
