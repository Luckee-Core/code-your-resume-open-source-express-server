import { ensureCrmDataDir } from "../../data/crm/crm-json-io";

/**
 * Creates the CRM vault directory on server boot so first write never races mkdir.
 */
export const ensureCrmDataDirAtStartup = async (): Promise<void> => {
  await ensureCrmDataDir();
};
