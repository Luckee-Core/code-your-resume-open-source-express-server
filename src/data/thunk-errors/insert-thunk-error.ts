import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { InsertThunkErrorInput } from "./types";

/**
 * Inserts one row into `thunk_errors`.
 *
 * @param supabase - Supabase service-role client
 * @param input - Row fields including server-enriched metadata
 */
export const insertThunkError = async (
  supabase: SupabaseClient,
  input: InsertThunkErrorInput,
): Promise<void> => {
  const { error } = await supabase.from("thunk_errors").insert({
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

  if (error) {
    console.error("❌ insertThunkError:", error.message);
    throw new Error(`Failed to insert thunk error: ${error.message}`);
  }
};
