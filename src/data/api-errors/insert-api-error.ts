import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import { insertRow } from "../../utils/postgres";
import type { InsertApiErrorInput } from "./types";

/**
 * Inserts one row into `api_errors`.
 *
 * @param pool - Supabase service-role client
 * @param input - Row fields including server-enriched metadata
 */
export const insertApiError = async (
  pool: Pool,
  input: InsertApiErrorInput,
): Promise<void> => {
  try {
    await insertRow(pool, "api_errors", {
      id: randomUUID(),
      event: input.event,
      severity: input.severity,
      message: input.message,
      stack: input.stack,
      http_method: input.httpMethod,
      route_path: input.routePath,
      status_code: input.statusCode,
      upstream: input.upstream,
      app_slug: input.appSlug,
      environment: input.environment,
      release: input.release,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ insertApiError:", message);
    throw new Error(`Failed to insert API error: ${message}`);
  }
};
