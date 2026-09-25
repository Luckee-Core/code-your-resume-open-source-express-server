import type { Pool } from "pg";

/**
 * Clears `is_tenant` on all LinkedIn profiles except the optional keep id.
 */
export const clearOtherTenantLinkedInProfileFlags = async (
  pool: Pool,
  keepId?: string,
): Promise<void> => {
  try {
    await pool.query(
      "UPDATE linkedin_profiles SET is_tenant = false WHERE is_tenant = true" +
        (keepId ? " AND id <> $1" : ""),
      keepId ? [keepId] : [],
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ clearOtherTenantLinkedInProfileFlags:", message);
    throw new Error(message);
  }
};
