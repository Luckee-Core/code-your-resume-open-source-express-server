import type { Response } from "express";
import type { Pool } from "pg";
import { getManagedPgPool } from "../../../services/postgres";

const NOT_CONFIGURED =
  "Postgres not configured on Express. Set DATABASE_URL in code-your-resume-open-source-express-server/.env";

/**
 * Returns the Express Postgres pool or sends 500 and returns null.
 */
export const getPgPoolForImageGraphicHandler = (res: Response): Pool | null => {
  const pool = getManagedPgPool();
  if (!pool) {
    res.status(500).json({ success: false, error: NOT_CONFIGURED });
    return null;
  }
  return pool;
};
