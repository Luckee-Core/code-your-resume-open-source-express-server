import type { Pool } from "pg";
import { getManagedPgPool } from "../../services/postgres";

/**
 * Returns the CRM Postgres pool. CRM data always lives in local Postgres.
 */
export const requireCrmPgPool = (): Pool => {
  const pool = getManagedPgPool();
  if (!pool) {
    throw new Error("Postgres is required for CRM: set DATABASE_URL on the Express server.");
  }
  return pool;
};
