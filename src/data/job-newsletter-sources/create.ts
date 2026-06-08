import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreateJobNewsletterSourceInput, JobNewsletterSource } from "./types";
import { normalizeSenderEmail } from "./get-by-sender-email";

/**
 * Insert a job newsletter source configuration row.
 */
export const createJobNewsletterSource = async (
  supabase: SupabaseClient,
  input: CreateJobNewsletterSourceInput,
): Promise<JobNewsletterSource> => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("job_newsletter_sources")
    .insert({
      name: input.name.trim(),
      sender_email: normalizeSenderEmail(input.sender_email),
      enabled: input.enabled ?? true,
      parse_instructions: input.parse_instructions.trim(),
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single();

  if (error) {
    console.error("❌ createJobNewsletterSource:", error.message);
    throw new Error(error.message);
  }

  return data as JobNewsletterSource;
};
