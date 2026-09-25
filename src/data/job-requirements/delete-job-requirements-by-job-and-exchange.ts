import type { Pool } from "pg";
import { deleteRows } from "../../utils/postgres";

/**
 * Deletes `job_requirements` rows for one job + listing AI exchange.
 */
export const deleteJobRequirementsByJobAndExchange = async (
  pool: Pool,
  jobId: string,
  exchangeId: string,
): Promise<void> => {
  await deleteRows(pool, "job_requirements", {
    job_id: jobId,
    exchange_id: exchangeId,
  });
};
