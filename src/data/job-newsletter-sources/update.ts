import type { SupabaseClient } from "@supabase/supabase-js";
import type { JobNewsletterSource, UpdateJobNewsletterSourceInput } from "./types";
import { normalizeSenderEmail } from "./get-by-sender-email";

/**
 * Update a job newsletter source by id.
 */
export const updateJobNewsletterSource = async (
  supabase: SupabaseClient,
  id: string,
  input: UpdateJobNewsletterSourceInput,
): Promise<JobNewsletterSource> => {
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) updates.name = input.name.trim();
  if (input.sender_email !== undefined) {
    updates.sender_email = normalizeSenderEmail(input.sender_email);
  }
  if (input.enabled !== undefined) updates.enabled = input.enabled;
  if (input.parse_instructions !== undefined) {
    updates.parse_instructions = input.parse_instructions.trim();
  }

  const { data, error } = await supabase
    .from("job_newsletter_sources")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("❌ updateJobNewsletterSource:", error.message);
    throw new Error(error.message);
  }

  return data as JobNewsletterSource;
};
