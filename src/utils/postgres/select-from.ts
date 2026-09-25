import type { Pool, QueryResultRow } from "pg";
import { assertSafeIdent } from "./assert-safe-ident";
import { queryRows } from "./query-rows";

export type SelectFromOptions = {
  columns?: string;
  eq?: Record<string, unknown>;
  neq?: Record<string, unknown>;
  in?: Record<string, unknown[]>;
  order?: { column: string; ascending?: boolean }[];
  limit?: number;
};

const columnsSql = (columns: string | undefined): string => {
  if (!columns || columns.trim() === "*") return "*";
  return columns
    .split(",")
    .map((part) => assertSafeIdent(part.trim()))
    .join(", ");
};

/**
 * Parameterized SELECT from a table with equality / IN / order / limit.
 */
export const selectRowsFrom = async <T extends QueryResultRow = QueryResultRow>(
  pool: Pool,
  table: string,
  options: SelectFromOptions = {},
): Promise<T[]> => {
  const tableName = assertSafeIdent(table);
  const values: unknown[] = [];
  const where: string[] = [];

  for (const [column, value] of Object.entries(options.eq ?? {})) {
    values.push(value);
    where.push(`${assertSafeIdent(column)} = $${values.length}`);
  }
  for (const [column, value] of Object.entries(options.neq ?? {})) {
    values.push(value);
    where.push(`${assertSafeIdent(column)} <> $${values.length}`);
  }
  for (const [column, list] of Object.entries(options.in ?? {})) {
    values.push(list);
    where.push(`${assertSafeIdent(column)} = ANY($${values.length})`);
  }

  let sql = `SELECT ${columnsSql(options.columns)} FROM ${tableName}`;
  if (where.length > 0) {
    sql += ` WHERE ${where.join(" AND ")}`;
  }
  const orderParts = (options.order ?? []).map((order) => {
    const dir = order.ascending === false ? "DESC" : "ASC";
    return `${assertSafeIdent(order.column)} ${dir}`;
  });
  if (orderParts.length > 0) {
    sql += ` ORDER BY ${orderParts.join(", ")}`;
  }
  if (options.limit != null) {
    values.push(options.limit);
    sql += ` LIMIT $${values.length}`;
  }

  return queryRows<T>(pool, sql, values);
};

/**
 * SELECT returning the first row or null.
 */
export const selectOneFrom = async <T extends QueryResultRow = QueryResultRow>(
  pool: Pool,
  table: string,
  options: SelectFromOptions = {},
): Promise<T | null> => {
  const rows = await selectRowsFrom<T>(pool, table, { ...options, limit: options.limit ?? 1 });
  return rows[0] ?? null;
};
