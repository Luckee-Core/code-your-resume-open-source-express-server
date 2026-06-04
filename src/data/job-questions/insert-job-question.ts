import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { JobQuestion } from "./types";
import { getJobQuestion } from "./get-job-question";

/**
 * Inserts a standalone job question row.
 */
export const insertJobQuestion = async (
  supabase: SupabaseClient,
  input: { prompt: string },
): Promise<JobQuestion> => {
  const id = randomUUID();
  const now = new Date().toISOString();
  const prompt = input.prompt.trim();
  if (!prompt) {
    throw new Error("prompt is required");
  }

  const { error } = await supabase.from("job_questions").insert({
    id,
    prompt,
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error("❌ insertJobQuestion:", error.message);
    throw new Error(error.message);
  }

  const row = await getJobQuestion(supabase, id);
  if (!row) {
    throw new Error("Failed to load job question after insert");
  }
  return row;
};
