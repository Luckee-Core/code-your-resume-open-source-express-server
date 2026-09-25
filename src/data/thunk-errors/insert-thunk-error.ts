import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import { insertRow } from "../../utils/postgres";
import type { InsertThunkErrorInput } from "./types";

/**
 * Inserts one row into `thunk_errors`.
 *
 * @param pool - Supabase service-role client
 * @param input - Row fields including server-enriched metadata
 */
export const insertThunkError = async (
  pool: Pool,
  input: InsertThunkErrorInput,
): Promise<void> => {
  try {
    await insertRow(pool, "thunk_errors", {
      id: randomUUID(),
      event: input.event,
      severity: input.severity,
      message: input.message,
      stack: input.stack,
      thunk_name: input.thunkName,
      collection: input.collection,
      entity_id: input.entityId,
      user_id: input.userId,
      app_slug: input.appSlug,
      environment: input.environment,
      release: input.release,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ insertThunkError:", message);
    throw new Error(`Failed to insert thunk error: ${message}`);
  }
};
