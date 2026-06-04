import fs from "node:fs/promises";
import { crmCollectionPath } from "./crm-collection-path";

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
