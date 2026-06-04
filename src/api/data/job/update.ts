import type { Request, Response } from "express";
import { updateJobInStore } from "../../../data/crm";
import type { Job, JobStatus, JobType } from "../../../data/crm/types";

type Body = {
  id?: unknown;
  companyId?: unknown;
  type?: unknown;
  title?: unknown;
  url?: unknown;
  status?: unknown;
  description?: unknown;
  listingImportedAt?: unknown;
  latestScrapeRunId?: unknown;
  latestAiExchangeId?: unknown;
};

export const handleJobUpdate = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) {
      res.status(400).json({ success: false, error: "id is required" });
      return;
    }
    const patch: Partial<
      Pick<
        Job,
        | "companyId"
        | "type"
        | "title"
        | "url"
        | "status"
        | "description"
        | "listingImportedAt"
        | "latestScrapeRunId"
        | "latestAiExchangeId"
      >
    > = {};
    if (typeof body.companyId === "string") patch.companyId = body.companyId;
    if (body.type === "contract" || body.type === "job") patch.type = body.type as JobType;
    if (typeof body.title === "string") patch.title = body.title;
    if (typeof body.url === "string") patch.url = body.url;
    if (typeof body.status === "string") patch.status = body.status as JobStatus;
    if (typeof body.description === "string") patch.description = body.description;
    if (typeof body.listingImportedAt === "string") patch.listingImportedAt = body.listingImportedAt;
    if (typeof body.latestScrapeRunId === "string") patch.latestScrapeRunId = body.latestScrapeRunId;
    if (typeof body.latestAiExchangeId === "string") patch.latestAiExchangeId = body.latestAiExchangeId;
    const data = await updateJobInStore(id, patch);
    if (!data) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }
    res.status(200).json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, error: "Failed to update job" });
  }
};
