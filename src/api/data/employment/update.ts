import type { Request, Response } from "express";
import { getJobFromStore } from "../../../data/crm";
import type { Employment } from "../../../data/crm/types";
import { getEmploymentFromStore, updateEmploymentInStore } from "../../../data/crm";

type Body = {
  id?: unknown;
  companyId?: unknown;
  jobId?: unknown;
  startDate?: unknown;
  endDate?: unknown;
};

/**
 * PATCH /api/data/employment/update — patch employment; validates job/company invariant when jobId or companyId change.
 */
export const handleEmploymentUpdate = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }

    const existing = await getEmploymentFromStore(id);
    if (!existing) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }

    const nextCompanyId =
      typeof body.companyId === "string" ? body.companyId.trim() : existing.companyId;
    const nextJobId = typeof body.jobId === "string" ? body.jobId.trim() : existing.jobId;

    const patch: Partial<Pick<Employment, "companyId" | "jobId" | "startDate" | "endDate">> = {};
    if (typeof body.startDate === "string") patch.startDate = body.startDate.trim();
    if (typeof body.endDate === "string") patch.endDate = body.endDate.trim();
    if (typeof body.companyId === "string") patch.companyId = nextCompanyId;
    if (typeof body.jobId === "string") patch.jobId = nextJobId;

    const effectiveCompany = patch.companyId ?? existing.companyId;
    const effectiveJobId = patch.jobId ?? existing.jobId;

    const job = await getJobFromStore(effectiveJobId);
    if (!job) {
      res.status(400).json({ success: false, error: "job not found" });
      return;
    }
    if (job.companyId !== effectiveCompany) {
      res.status(400).json({
        success: false,
        error: "job.companyId must match companyId",
      });
      return;
    }

    const data = await updateEmploymentInStore(id, patch);
    if (!data) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Failed to update employment" });
  }
};
