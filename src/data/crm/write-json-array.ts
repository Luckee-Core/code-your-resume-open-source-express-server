import fs from "node:fs/promises";
import { ensureCrmDataDir } from "./ensure-crm-data-dir";
import { crmCollectionPath } from "./crm-collection-path";

/**
 * Writes a JSON array to disk (pretty-printed).
 */
export const writeJsonArray = async <T>(filename: string, rows: T[]): Promise<void> => {
  await ensureCrmDataDir();
  await fs.writeFile(crmCollectionPath(filename), `${JSON.stringify(rows, null, 2)}\n`, "utf8");
};
