import type { Pool, QueryResultRow } from "pg";
import { assertSafeIdent } from "./assert-safe-ident";
import { queryRows } from "./query-rows";

/**
 * Inserts one row and returns the inserted row when RETURNING * is used.
 */
export const insertRow = async <T extends QueryResultRow = QueryResultRow>(
  pool: Pool,
  table: string,
  row: Record<string, unknown>,
): Promise<T> => {
  const tableName = assertSafeIdent(table);
  const keys = Object.keys(row).map(assertSafeIdent);
  if (keys.length === 0) {
    throw new Error(`insertRow: empty row for ${tableName}`);
  }
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
  const rows = await queryRows<T>(
    pool,
    `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`,
    keys.map((key) => row[key]),
  );
  const inserted = rows[0];
  if (!inserted) {
    throw new Error(`insertRow: no row returned from ${tableName}`);
  }
  return inserted;
};

/**
 * Inserts many rows. No-op when `rows` is empty.
 */
export const insertRows = async (
  pool: Pool,
  table: string,
  rows: Record<string, unknown>[],
): Promise<void> => {
  if (rows.length === 0) return;
  const tableName = assertSafeIdent(table);
  const keys = Object.keys(rows[0] ?? {}).map(assertSafeIdent);
  if (keys.length === 0) {
    throw new Error(`insertRows: empty row for ${tableName}`);
  }
  const values: unknown[] = [];
  const tuples = rows.map((row, rowIndex) => {
    const placeholders = keys.map((key, colIndex) => {
      values.push(row[key]);
      return `$${rowIndex * keys.length + colIndex + 1}`;
    });
    return `(${placeholders.join(", ")})`;
  });
  await queryRows(
    pool,
    `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES ${tuples.join(", ")}`,
    values,
  );
};
