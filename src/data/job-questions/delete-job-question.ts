import type { Pool } from "pg";
import { deleteRows, isForeignKeyViolation } from "../../utils/postgres";

/**
 * Deletes a job question by id. Fails when answers still reference it (FK RESTRICT).
 */
export const deleteJobQuestion = async (pool: Pool, id: string): Promise<boolean> => {
  try {
    const count = await deleteRows(pool, "job_questions", { id });
    return count > 0;
  } catch (error) {
    console.error("❌ deleteJobQuestion:", error);
    if (isForeignKeyViolation(error)) {
      throw new Error("Question is linked to jobs; remove those answers first");
    }
    throw error;
  }
};
