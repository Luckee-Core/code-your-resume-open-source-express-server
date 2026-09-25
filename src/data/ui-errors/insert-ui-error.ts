import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import { insertRow } from "../../utils/postgres";
import type { InsertUiErrorInput } from "./types";

/**
 * Inserts one row into `ui_errors`.
 *
 * @param pool - Supabase service-role client
 * @param input - Row fields including server-enriched metadata
 */
export const insertUiError = async (
  pool: Pool,
  input: InsertUiErrorInput,
): Promise<void> => {
  try {
    await insertRow(pool, "ui_errors", {
      id: randomUUID(),
      event: input.event,
      severity: input.severity,
      message: input.message,
      stack: input.stack,
      route_path: input.routePath,
      component_name: input.componentName,
      digest: input.digest,
      app_slug: input.appSlug,
      environment: input.environment,
      release: input.release,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ insertUiError:", message);
    throw new Error(`Failed to insert UI error: ${message}`);
  }
};
