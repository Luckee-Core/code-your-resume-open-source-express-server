import type { JobStatus } from "./types";

/**
 * Type guard for CRM job status enum values.
 */
export const isJobStatus = (value: unknown): value is JobStatus => {
  return (
    value === "draft" ||
    value === "applied" ||
    value === "interview" ||
    value === "rejected" ||
    value === "closed" ||
    value === "archived"
  );
};
