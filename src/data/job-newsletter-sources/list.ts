import type { Pool } from "pg";
import { selectRowsFrom } from "../../utils/postgres";
import type { JobNewsletterSource } from "./types";

/**
 * List all job newsletter sources, newest first.
 */
export const listJobNewsletterSources = async (
  pool: Pool,
): Promise<JobNewsletterSource[]> => {
  try {
    return await selectRowsFrom<JobNewsletterSource>(pool, "job_newsletter_sources", {
      order: [{ column: "created_at", ascending: false }],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ listJobNewsletterSources:", message);
    throw new Error(message);
  }
};
