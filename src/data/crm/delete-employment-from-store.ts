import { requireCrmSupabaseClient } from "./require-crm-supabase-client";

/**
 * Deletes an employment row from Supabase CRM.
 */
export const deleteEmploymentFromStore = async (id: string): Promise<boolean> => {
  const supabase = requireCrmSupabaseClient();
  const { data, error } = await supabase.from("employments").delete().eq("id", id).select("id");

  if (error) {
    console.error("❌ deleteEmploymentInStore:", error.message);
    throw new Error(error.message);
  }

  return (data?.length ?? 0) > 0;
};
