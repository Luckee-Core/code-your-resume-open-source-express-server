import type { Pool, QueryResultRow } from "pg";
import { assertSafeIdent } from "./assert-safe-ident";
import { queryRows } from "./query-rows";

/**
 * Inserts rows and on conflict updates every non-conflict column.
 */
export const upsertRows = async <T extends QueryResultRow = QueryResultRow>(
  pool: Pool,
  table: string,
  rows: Record<string, unknown>[],
  conflictColumns: string[],
): Promise<T[]> => {
  if (rows.length === 0) return [];
  const tableName = assertSafeIdent(table);
  const keys = Object.keys(rows[0] ?? {}).map(assertSafeIdent);
  const conflict = conflictColumns.map(assertSafeIdent);
  const updateKeys = keys.filter((key) => !conflict.includes(key));
  const values: unknown[] = [];
  const tuples = rows.map((row, rowIndex) => {
    const placeholders = keys.map((key, colIndex) => {
      values.push(row[key]);
      return `$${rowIndex * keys.length + colIndex + 1}`;
    });
    return `(${placeholders.join(", ")})`;
  });
  const setClause =
    updateKeys.length > 0
      ? updateKeys.map((key) => `${key} = EXCLUDED.${key}`).join(", ")
      : conflict.map((key) => `${key} = EXCLUDED.${key}`).join(", ");
  return queryRows<T>(
    pool,
    `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES ${tuples.join(", ")}
     ON CONFLICT (${conflict.join(", ")}) DO UPDATE SET ${setClause}
     RETURNING *`,
    values,
  );
};
