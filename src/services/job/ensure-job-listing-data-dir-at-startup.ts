import { ensureJobListingDataDir } from "../../data/job-listing";

/**
 * Ensures the job-listing ledger directory exists before the server accepts traffic.
 */
export const ensureJobListingDataDirAtStartup = async (): Promise<void> => {
  await ensureJobListingDataDir();
};
