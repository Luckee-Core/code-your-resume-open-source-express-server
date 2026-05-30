import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { InsertUiErrorInput } from "./types";

/**
 * Inserts one row into `ui_errors`.
 *
 * @param supabase - Supabase service-role client
 * @param input - Row fields including server-enriched metadata
 */
export const insertUiError = async (
  supabase: SupabaseClient,
  input: InsertUiErrorInput,
): Promise<void> => {
  const { error } = await supabase.from("ui_errors").insert({
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

  if (error) {
    console.error("❌ insertUiError:", error.message);
    throw new Error(`Failed to insert UI error: ${error.message}`);
  }
};
