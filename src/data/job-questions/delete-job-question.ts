import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Deletes a job question by id. Fails when answers still reference it (FK RESTRICT).
 */
export const deleteJobQuestion = async (supabase: SupabaseClient, id: string): Promise<boolean> => {
  const { error, count } = await supabase.from("job_questions").delete({ count: "exact" }).eq("id", id);

  if (error) {
    console.error("❌ deleteJobQuestion:", error.message);
    if (error.code === "23503") {
      throw new Error("Question is linked to jobs; remove those answers first");
    }
    throw new Error(error.message);
  }

  return (count ?? 0) > 0;
};
