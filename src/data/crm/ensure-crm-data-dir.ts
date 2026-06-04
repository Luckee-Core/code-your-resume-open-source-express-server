import fs from "node:fs/promises";
import { getCrmDataDir } from "./get-crm-data-dir";

/**
 * Ensures the CRM data directory exists before read/write.
 */
export const ensureCrmDataDir = async (): Promise<void> => {
  await fs.mkdir(getCrmDataDir(), { recursive: true });
};
