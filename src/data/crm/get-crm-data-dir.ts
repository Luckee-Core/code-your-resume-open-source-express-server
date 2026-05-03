import path from "node:path";

/**
 * Resolved directory for CRM JSON collections.
 * Set `CRM_DATA_DIR` to an absolute path in production.
 */
export const getCrmDataDir = (): string => {
  const raw = process.env.CRM_DATA_DIR?.trim();
  if (raw) {
    return path.resolve(raw);
  }
  return path.join(process.cwd(), ".data", "crm");
};
