import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { InsertApiErrorInput } from "./types";

/**
 * Inserts one row into `api_errors`.
 *
 * @param supabase - Supabase service-role client
 * @param input - Row fields including server-enriched metadata
 */
export const insertApiError = async (
  supabase: SupabaseClient,
  input: InsertApiErrorInput,
): Promise<void> => {
  const { error } = await supabase.from("api_errors").insert({
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

  if (error) {
    console.error("❌ insertApiError:", error.message);
    throw new Error(`Failed to insert API error: ${error.message}`);
  }
};
