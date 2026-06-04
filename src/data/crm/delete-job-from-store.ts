import { requireCrmSupabaseClient } from "./require-crm-supabase-client";

/**
 * Deletes a job row from Supabase CRM.
 */
export const deleteJobFromStore = async (id: string): Promise<boolean> => {
  const supabase = requireCrmSupabaseClient();
  const { data, error } = await supabase.from("jobs").delete().eq("id", id).select("id");

  if (error) {
    console.error("❌ deleteJobFromStore:", error.message);
    throw new Error(error.message);
  }

  return (data?.length ?? 0) > 0;
};
