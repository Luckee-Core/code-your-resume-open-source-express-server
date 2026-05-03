import type { Employment } from "./types";

/**
 * Normalizes legacy or partial `employments.json` rows.
 */
export const normalizeEmployment = (raw: unknown): Employment => {
  const r = raw as Partial<Employment> & Record<string, unknown>;
  return {
    id: typeof r.id === "string" ? r.id : "",
    companyId: typeof r.companyId === "string" ? r.companyId : "",
    jobId: typeof r.jobId === "string" ? r.jobId : "",
    startDate: typeof r.startDate === "string" ? r.startDate : "",
    endDate: typeof r.endDate === "string" ? r.endDate : "",
    createdAt: typeof r.createdAt === "string" ? r.createdAt : "",
    updatedAt: typeof r.updatedAt === "string" ? r.updatedAt : "",
  };
};
