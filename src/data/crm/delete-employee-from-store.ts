import { requireCrmSupabaseClient } from "./require-crm-supabase-client";

/**
 * Deletes an employee row from Supabase CRM.
 */
export const deleteEmployeeFromStore = async (id: string): Promise<boolean> => {
  const supabase = requireCrmSupabaseClient();
  const { data, error } = await supabase.from("employees").delete().eq("id", id).select("id");

  if (error) {
    console.error("❌ deleteEmployeeInStore:", error.message);
    throw new Error(error.message);
  }

  return (data?.length ?? 0) > 0;
};
