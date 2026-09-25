import type { Pool, QueryResultRow } from "pg";
import { assertSafeIdent } from "./assert-safe-ident";
import { queryRows } from "./query-rows";

/**
 * Fetches rows by primary key `id` (deduped).
 */
export const batchFetchRowsByIds = async (
  pool: Pool,
  table: string,
  ids: string[],
  columns = "*",
): Promise<Map<string, Record<string, unknown>>> => {
  const uniqueIds = [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
  const map = new Map<string, Record<string, unknown>>();
  if (uniqueIds.length === 0) return map;

  const tableName = assertSafeIdent(table);
  const selectList =
    columns === "*"
      ? "*"
      : columns
          .split(",")
          .map((part) => assertSafeIdent(part.trim()))
          .join(", ");

  const rows = await queryRows<QueryResultRow>(
    pool,
    `SELECT ${selectList} FROM ${tableName} WHERE id = ANY($1::uuid[])`,
    [uniqueIds],
  );

  for (const row of rows) {
    const record = row as Record<string, unknown>;
    map.set(String(record.id ?? ""), record);
  }

  return map;
};
