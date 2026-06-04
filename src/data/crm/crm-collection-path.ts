import path from "node:path";
import { getCrmDataDir } from "./get-crm-data-dir";

/**
 * Full path to a collection JSON file (array of rows).
 */
export const crmCollectionPath = (filename: string): string =>
  path.join(getCrmDataDir(), filename);
