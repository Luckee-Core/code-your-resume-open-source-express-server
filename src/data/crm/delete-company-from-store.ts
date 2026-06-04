import { requireCrmSupabaseClient } from "./require-crm-supabase-client";

/**
 * Deletes a company row from Supabase CRM.
 */
export const deleteCompanyFromStore = async (id: string): Promise<boolean> => {
  const supabase = requireCrmSupabaseClient();
  const { data, error } = await supabase.from("companies").delete().eq("id", id).select("id");

  if (error) {
    console.error("❌ deleteCompanyInStore:", error.message);
    throw new Error(error.message);
  }

  return (data?.length ?? 0) > 0;
};
