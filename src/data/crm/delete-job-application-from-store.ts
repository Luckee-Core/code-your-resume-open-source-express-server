import { requireCrmSupabaseClient } from "./require-crm-supabase-client";

/**
 * Deletes a job application row from Supabase CRM.
 */
export const deleteJobApplicationFromStore = async (id: string): Promise<boolean> => {
  const supabase = requireCrmSupabaseClient();
  const { data, error } = await supabase.from("job_applications").delete().eq("id", id).select("id");

  if (error) {
    console.error("❌ deleteJobApplicationFromStore:", error.message);
    throw new Error(error.message);
  }

  return (data?.length ?? 0) > 0;
};
