import { ensureCrmDataDir } from "../../data/crm/ensure-crm-data-dir";

/**
 * Creates the CRM vault directory on server boot so first write never races mkdir.
 */
export const ensureCrmDataDirAtStartup = async (): Promise<void> => {
  await ensureCrmDataDir();
};
