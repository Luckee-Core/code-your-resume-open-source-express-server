import type { Request, Response } from "express";
import { getCompanyFromStore } from "../../../data/crm";
import { createJobInStore } from "../../../data/crm";
import type { JobStatus, JobType } from "../../../data/crm/types";
import { runJobListingImport } from "../../../services/job/scrape-job-listing";
import { validatePublicJobListingUrl } from "../../../services/job/validate-public-job-listing-url";

type Body = {
  companyId?: unknown;
  title?: unknown;
  url?: unknown;
  status?: unknown;
  type?: unknown;
};

/**
 * POST /api/data/job/create — writes a new Job row to the CRM JSON vault.
 * When `url` is non-empty, validates a public posting URL, then runs
 * {@link runJobListingImport} (HTTP scrape + optional Anthropic), same pipeline as
 * `POST /api/data/job/import-listing` and `POST /api/data/job/create-from-listing-url`.
 * When `url` is omitted or blank, only the vault write runs.
 */
export const handleJobCreate = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Body;
    const companyId = typeof body.companyId === "string" ? body.companyId : "";
    const title = typeof body.title === "string" ? body.title : "";
    if (!companyId.trim() || !title.trim()) {
      res.status(400).json({ success: false, error: "companyId and title are required" });
      return;
    }
    const urlRaw = typeof body.url === "string" ? body.url : "";
    const status = (typeof body.status === "string" ? body.status : "draft") as JobStatus;
    const type: JobType = body.type === "contract" ? "contract" : "job";

    let listingHref = "";
    const trimmedUrl = urlRaw.trim();
    if (trimmedUrl) {
      const urlCheck = validatePublicJobListingUrl(trimmedUrl);
      if (!urlCheck.ok) {
        res.status(400).json({ success: false, error: urlCheck.error });
        return;
      }
      listingHref = urlCheck.href;
    }

    const hasPostingUrl = listingHref.length > 0;

    console.log("📥 POST /api/data/job/create", {
      companyId,
      titlePreview: title.slice(0, 80),
      hasPostingUrl,
      willRunImport: hasPostingUrl,
      status,
    });

    const data = await createJobInStore({
      companyId,
      type,
      title,
      url: hasPostingUrl ? listingHref : urlRaw,
      status,
    });

    if (!hasPostingUrl) {
      console.log("✅ job/create: row written (no posting URL — skip import)", { jobId: data.id });
      res.status(201).json({ success: true, data });
      return;
    }

    const company =
      data.companyId.trim() !== "" ? await getCompanyFromStore(data.companyId) : null;

    console.log("📥 job/create: runJobListingImport (scrape + optional Anthropic)", {
      jobId: data.id,
      urlPreview: listingHref.slice(0, 120),
      hasAnthropicKey: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
    });

    const result = await runJobListingImport({
      job: data,
      sourceUrl: listingHref,
      companyName: company?.name,
    });

    if (!result.ok) {
      console.log("⚠️ job/create: import failed after row created", {
        jobId: data.id,
        error: result.error,
      });
      res.status(result.statusCode).json({
        success: false,
        error: result.error,
        data,
        scrapeRunId: result.scrapeRunId,
      });
      return;
    }

    console.log("✅ job/create: row + import done", {
      jobId: result.job.id,
      scrapeRunId: result.scrapeRunId,
      exchangeId: result.exchangeId,
    });
    res.status(201).json({
      success: true,
      data: result.job,
      scrapeRunId: result.scrapeRunId,
      exchangeId: result.exchangeId,
    });
  } catch {
    res.status(500).json({ success: false, error: "Failed to create job" });
  }
};
