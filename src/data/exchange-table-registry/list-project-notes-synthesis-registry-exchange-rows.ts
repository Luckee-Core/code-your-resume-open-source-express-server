import type { Pool } from "pg";
import { batchFetchRowsByIds, selectRowsFrom } from "../../utils/postgres";
import type { RegistryExchangeSourceRow } from "./list-exchange-rows-from-registry-entry";

/**
 * Lists project_notes_synthesis_exchanges; token usage lives on project_notes_synthesis_responses.
 */
export const listProjectNotesSynthesisRegistryExchangeRows = async (
  pool: Pool,
  limit: number,
): Promise<{ rows: RegistryExchangeSourceRow[] } | { error: string }> => {
  const lim = Math.min(Math.max(limit, 1), 200);

  try {
    const exchanges = await selectRowsFrom(pool, "project_notes_synthesis_exchanges", {
      columns: "id, project_id, created_at, response_id",
      order: [{ column: "created_at", ascending: false }],
      limit: lim,
    });

    const responseIds = exchanges.map((row) => String(row.response_id ?? ""));
    const responseById = await batchFetchRowsByIds(
      pool,
      "project_notes_synthesis_responses",
      responseIds,
      "id, status, model, usage_input_tokens, usage_output_tokens",
    );

    const rows = exchanges.map((row) => {
      const response = responseById.get(String(row.response_id ?? ""));
      const responseStatus = String(response?.status ?? "");

      return {
        exchange_id: String(row.id),
        status: responseStatus === "success" ? "completed" : responseStatus || "unknown",
        input_tokens:
          typeof response?.usage_input_tokens === "number" ? response.usage_input_tokens : null,
        output_tokens:
          typeof response?.usage_output_tokens === "number" ? response.usage_output_tokens : null,
        model_used: typeof response?.model === "string" ? response.model : null,
        occurred_at: String(row.created_at ?? ""),
        job_id: null,
        source_id: String(row.project_id ?? "") || null,
        context_label: null,
        profile_id: null,
      };
    });

    return { rows };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { error: message };
  }
};
