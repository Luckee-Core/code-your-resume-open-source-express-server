import fs from "node:fs/promises";
import path from "node:path";
import { getCrmDataDir } from "./get-crm-data-dir";

/**
 * Ensures the CRM data directory exists before read/write.
 */
export const ensureCrmDataDir = async (): Promise<void> => {
  await fs.mkdir(getCrmDataDir(), { recursive: true });
};

/**
 * Full path to a collection JSON file (array of rows).
 */
export const crmCollectionPath = (filename: string): string =>
  path.join(getCrmDataDir(), filename);

/**
 * Reads a JSON array from disk; returns `fallback` if missing or invalid.
 */
export const readJsonArray = async <T>(filename: string, fallback: T[]): Promise<T[]> => {
  try {
    const raw = await fs.readFile(crmCollectionPath(filename), "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return fallback;
    return parsed as T[];
  } catch {
    return fallback;
  }
};

/**
 * Writes a JSON array to disk (pretty-printed).
 */
export const writeJsonArray = async <T>(filename: string, rows: T[]): Promise<void> => {
  await ensureCrmDataDir();
  await fs.writeFile(crmCollectionPath(filename), `${JSON.stringify(rows, null, 2)}\n`, "utf8");
};
