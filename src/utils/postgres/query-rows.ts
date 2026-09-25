import type { Pool, QueryResultRow } from "pg";

/**
 * Runs parameterized SQL and returns rows. Throws with the Postgres error message.
 */
export const queryRows = async <T extends QueryResultRow = QueryResultRow>(
  pool: Pool,
  text: string,
  values: unknown[] = [],
): Promise<T[]> => {
  const result = await pool.query<T>(text, values);
  return result.rows;
};

/**
 * Runs parameterized SQL and returns the first row or null.
 */
export const queryOne = async <T extends QueryResultRow = QueryResultRow>(
  pool: Pool,
  text: string,
  values: unknown[] = [],
): Promise<T | null> => {
  const rows = await queryRows<T>(pool, text, values);
  return rows[0] ?? null;
};
