import type { Pool } from "pg";
import { selectOneFrom, updateRows } from "../../utils/postgres";
import type { JobNewsletterSource, UpdateJobNewsletterSourceInput } from "./types";
import { normalizeSenderEmail } from "./get-by-sender-email";

/**
 * Update a job newsletter source by id.
 */
export const updateJobNewsletterSource = async (
  pool: Pool,
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

  try {
    await updateRows(pool, "job_newsletter_sources", updates, { id });
    const data = await selectOneFrom<JobNewsletterSource>(pool, "job_newsletter_sources", {
      eq: { id },
    });
    if (!data) {
      throw new Error("Failed to load job_newsletter_sources row after update");
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ updateJobNewsletterSource:", message);
    throw new Error(message);
  }
};
