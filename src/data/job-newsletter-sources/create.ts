import type { Pool } from "pg";
import { insertRow } from "../../utils/postgres";
import type { CreateJobNewsletterSourceInput, JobNewsletterSource } from "./types";
import { normalizeSenderEmail } from "./get-by-sender-email";

/**
 * Insert a job newsletter source configuration row.
 */
export const createJobNewsletterSource = async (
  pool: Pool,
  input: CreateJobNewsletterSourceInput,
): Promise<JobNewsletterSource> => {
  const now = new Date().toISOString();
  try {
    return await insertRow<JobNewsletterSource>(pool, "job_newsletter_sources", {
      name: input.name.trim(),
      sender_email: normalizeSenderEmail(input.sender_email),
      enabled: input.enabled ?? true,
      parse_instructions: input.parse_instructions.trim(),
      created_at: now,
      updated_at: now,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ createJobNewsletterSource:", message);
    throw new Error(message);
  }
};
