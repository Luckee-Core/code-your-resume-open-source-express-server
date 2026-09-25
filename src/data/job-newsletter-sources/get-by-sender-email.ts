import type { Pool } from "pg";
import { selectRowsFrom } from "../../utils/postgres";
import type { JobNewsletterSource } from "./types";

/**
 * Normalize sender email for lookup (lowercase, trimmed).
 */
export const normalizeSenderEmail = (email: string): string => email.trim().toLowerCase();

/**
 * Find an enabled or disabled source row by sender email (case-insensitive).
 */
export const getJobNewsletterSourceBySenderEmail = async (
  pool: Pool,
  senderEmail: string,
): Promise<JobNewsletterSource | null> => {
  const normalized = normalizeSenderEmail(senderEmail);
  try {
    const data = await selectRowsFrom<JobNewsletterSource>(pool, "job_newsletter_sources");
    const match = data.find(
      (row) => normalizeSenderEmail(String(row.sender_email ?? "")) === normalized,
    );
    return match ?? null;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ getJobNewsletterSourceBySenderEmail:", message);
    throw new Error(message);
  }
};
