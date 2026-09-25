import type { Pool } from "pg";
import { assertSafeIdent } from "./assert-safe-ident";

export type DeleteWhere = Record<string, unknown | { neq: unknown }>;

/**
 * Deletes rows matching filters (`=` or `{ neq }`). Returns deleted row count.
 */
export const deleteRows = async (pool: Pool, table: string, where: DeleteWhere): Promise<number> => {
  const tableName = assertSafeIdent(table);
  const whereKeys = Object.keys(where).map(assertSafeIdent);
  if (whereKeys.length === 0) {
    throw new Error(`deleteRows: empty where for ${tableName}`);
  }
  const values: unknown[] = [];
  const clauses = whereKeys.map((key) => {
    const raw = where[key];
    if (raw && typeof raw === "object" && "neq" in raw) {
      values.push((raw as { neq: unknown }).neq);
      return `${key} <> $${values.length}`;
    }
    values.push(raw);
    return `${key} = $${values.length}`;
  });
  const result = await pool.query(`DELETE FROM ${tableName} WHERE ${clauses.join(" AND ")}`, values);
  return result.rowCount ?? 0;
};
