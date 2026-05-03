import fs from "node:fs/promises";
import path from "node:path";
import { getJobListingDataDir } from "./get-job-listing-data-dir";

/**
 * Ensures the job listing ledger directory exists before read/write.
 */
export const ensureJobListingDataDir = async (): Promise<void> => {
  await fs.mkdir(getJobListingDataDir(), { recursive: true });
};

/**
 * Full path to a ledger collection JSON file (array of rows).
 */
export const jobListingCollectionPath = (filename: string): string =>
  path.join(getJobListingDataDir(), filename);

/**
 * Reads a JSON array from disk; returns `fallback` if missing or invalid.
 */
export const readJobListingJsonArray = async <T>(filename: string, fallback: T[]): Promise<T[]> => {
  try {
    const raw = await fs.readFile(jobListingCollectionPath(filename), "utf8");
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
export const writeJobListingJsonArray = async <T>(filename: string, rows: T[]): Promise<void> => {
  await ensureJobListingDataDir();
  await fs.writeFile(
    jobListingCollectionPath(filename),
    `${JSON.stringify(rows, null, 2)}\n`,
    "utf8",
  );
};
