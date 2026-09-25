import type { Pool } from "pg";
import { deleteRows } from "../../utils/postgres";

/**
 * Deletes `job_responsibilities` rows for one job + listing AI exchange.
 */
export const deleteJobResponsibilitiesByJobAndExchange = async (
  pool: Pool,
  jobId: string,
  exchangeId: string,
): Promise<void> => {
  await deleteRows(pool, "job_responsibilities", {
    job_id: jobId,
    exchange_id: exchangeId,
  });
};
