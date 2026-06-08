import type { SupabaseClient } from "@supabase/supabase-js";
import type { JobNewsletterSource } from "./types";

/**
 * Normalize sender email for lookup (lowercase, trimmed).
 */
export const normalizeSenderEmail = (email: string): string => email.trim().toLowerCase();

/**
 * Find an enabled or disabled source row by sender email (case-insensitive).
 */
export const getJobNewsletterSourceBySenderEmail = async (
  supabase: SupabaseClient,
  senderEmail: string,
): Promise<JobNewsletterSource | null> => {
  const normalized = normalizeSenderEmail(senderEmail);
  const { data, error } = await supabase
    .from("job_newsletter_sources")
    .select("*");

  if (error) {
    console.error("❌ getJobNewsletterSourceBySenderEmail:", error.message);
    throw new Error(error.message);
  }

  const match = (data ?? []).find(
    (row) => normalizeSenderEmail(String(row.sender_email ?? "")) === normalized,
  );

  return match ? (match as JobNewsletterSource) : null;
};
