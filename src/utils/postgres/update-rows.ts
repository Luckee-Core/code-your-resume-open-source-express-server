import type { Pool } from "pg";
import { assertSafeIdent } from "./assert-safe-ident";

/**
 * Updates rows matching equality filters. Returns the number of updated rows.
 */
export const updateRows = async (
  pool: Pool,
  table: string,
  row: Record<string, unknown>,
  where: Record<string, unknown>,
): Promise<number> => {
  const tableName = assertSafeIdent(table);
  const setKeys = Object.keys(row).map(assertSafeIdent);
  const whereKeys = Object.keys(where).map(assertSafeIdent);
  if (setKeys.length === 0) {
    throw new Error(`updateRows: empty patch for ${tableName}`);
  }
  if (whereKeys.length === 0) {
    throw new Error(`updateRows: empty where for ${tableName}`);
  }
  let i = 1;
  const setClause = setKeys.map((key) => `${key} = $${i++}`).join(", ");
  const whereClause = whereKeys.map((key) => `${key} = $${i++}`).join(" AND ");
  const result = await pool.query(
    `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`,
    [...setKeys.map((key) => row[key]), ...whereKeys.map((key) => where[key])],
  );
  return result.rowCount ?? 0;
};
