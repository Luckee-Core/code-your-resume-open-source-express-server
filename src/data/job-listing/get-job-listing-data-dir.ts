import path from "node:path";
import { getCrmDataDir } from "../crm/get-crm-data-dir";

/**
 * Directory for job listing scrape + AI ledger JSON files.
 * Override with `JOB_LISTING_DATA_DIR` (absolute path). Default: sibling of CRM vault (`../job-listing` from CRM dir).
 */
export const getJobListingDataDir = (): string => {
  const raw = process.env.JOB_LISTING_DATA_DIR?.trim();
  if (raw) {
    return path.resolve(raw);
  }
  return path.join(getCrmDataDir(), "..", "job-listing");
};
