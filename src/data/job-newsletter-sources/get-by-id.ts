import type { Pool } from "pg";
import { selectOneFrom } from "../../utils/postgres";
import type { JobNewsletterSource } from "./types";

/**
 * Get a job newsletter source by id.
 */
export const getJobNewsletterSourceById = async (
  pool: Pool,
  id: string,
): Promise<JobNewsletterSource | null> => {
  try {
    return await selectOneFrom<JobNewsletterSource>(pool, "job_newsletter_sources", {
      eq: { id },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ getJobNewsletterSourceById:", message);
    throw new Error(message);
  }
};
