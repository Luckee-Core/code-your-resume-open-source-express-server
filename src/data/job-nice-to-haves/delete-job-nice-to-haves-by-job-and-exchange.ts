import type { Pool } from "pg";
import { deleteRows } from "../../utils/postgres";

/**
 * Deletes `job_nice_to_have` rows for one job + listing AI exchange.
 */
export const deleteJobNiceToHavesByJobAndExchange = async (
  pool: Pool,
  jobId: string,
  exchangeId: string,
): Promise<void> => {
  await deleteRows(pool, "job_nice_to_have", {
    job_id: jobId,
    exchange_id: exchangeId,
  });
};
