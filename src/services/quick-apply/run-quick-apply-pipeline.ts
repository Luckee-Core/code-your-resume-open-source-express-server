import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createCompanyInStore,
  getCompanyFromStore,
  updateCompanyInStore,
} from "../../data/crm";
import { findCompanyByWebsiteFromSupabase } from "../../data/crm/supabase/find-company-by-website-from-supabase";
import { findJobByUrlFromSupabase } from "../../data/crm/supabase/find-job-by-url-from-supabase";
import { requireCrmSupabaseClient } from "../../data/crm/require-crm-supabase-client";
import type { Company, Job } from "../../data/crm/types";
import { discoverCompanySitePageUrls } from "../company/discover-company-site-page-urls";
import { runCompanyWebsiteResearch } from "../company/run-company-website-research";
import {
  assertHasActiveSkills,
  assertHasCandidateName,
  JobGenerationContextError,
  loadJobGenerationContext,
  type JobGenerationContext,
} from "../generation";
import {
  persistGeneratedJobGraphic,
  scheduleBackgroundJobGraphicGeneration,
} from "../job-graphic-generation";
import { createJobFromListingUrlAndImport } from "../job/create-job-from-listing-url-and-import";
import { runJobListingImport } from "../job/scrape-job-listing";
import { validatePublicJobListingUrl } from "../job/validate-public-job-listing-url";
import { runSkillsComponentGeneration } from "../skills-component-generation";
import { deriveCompanyNameFromWebsiteUrl } from "../../utils/company/derive-company-name-from-website-url";
import { normalizeCompanyWebsiteUrlInput } from "../../utils/company/normalize-company-website-url";

export type QuickApplyResult = {
  companyId: string;
  jobId: string;
  companyCreated: boolean;
  companyScrapeOk: boolean;
  jobScrapeOk: boolean;
  resumeQueued: boolean;
  resumeSkipReason?: string;
  warnings: string[];
  company?: Company;
  job?: Job;
};

export type RunQuickApplyPipelineInput = {
  companyWebsiteUrl: string;
  jobListingUrl: string;
};

export type RunQuickApplyPipelineOutcome =
  | { ok: true; data: QuickApplyResult }
  | { ok: false; statusCode: 400 | 422 | 500; error: string; data?: QuickApplyResult };

const normalizeListingUrlInput = (raw: string): string => {
  const t = raw.trim();
  if (!t) {
    return "";
  }
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
};

/**
 * Queue resume TSX generation in the background (same contract as skills-component generate).
 */
const queueResumeGenerationInBackground = (
  supabase: SupabaseClient,
  context: JobGenerationContext,
): void => {
  const label = `quick-apply resume job ${context.jobId}`;

  scheduleBackgroundJobGraphicGeneration(label, async () => {
    console.log(`🚀 Background ${label} — starting Cursor agent`);

    const result = await runSkillsComponentGeneration(supabase, {
      jobId: context.jobId,
      jobTitle: context.jobTitle,
      companyName: context.companyName,
      responsibilities: context.responsibilities,
      requirements: context.requirements,
      niceToHaves: context.niceToHaves,
      skills: context.skillPromptLines,
      voiceStyle: context.voiceStyle,
      projectsBlock: context.projectsBlock,
      candidateFullName: context.candidateFullName,
      appendedPromptSections: context.appendedPromptSections,
    });

    const graphic = await persistGeneratedJobGraphic(supabase, {
      kind: "resume",
      jobId: context.jobId,
      jobTitle: context.jobTitle,
      tsx: result.tsx,
      requestId: result.requestId,
      exchangeId: result.exchangeId,
    });

    console.log(
      `✅ Background ${label} — graphic ${graphic.id} persisted (${graphic.title})`,
    );
  });
};

/**
 * Best-effort company discover + website research; collects warnings without failing the pipeline.
 */
const runCompanyScrapePipeline = async (
  companyId: string,
): Promise<{ companyScrapeOk: boolean; warnings: string[]; company: Company | null }> => {
  const warnings: string[] = [];
  let company = await getCompanyFromStore(companyId);
  if (!company) {
    return { companyScrapeOk: false, warnings: ["Company not found after resolve"], company: null };
  }

  let scrapeOk = true;

  if (!company.playwrightWebsiteUrlDiscoveryAttempted) {
    const discover = await discoverCompanySitePageUrls(companyId);
    if (!discover.ok) {
      if (discover.code !== "already_attempted") {
        warnings.push(discover.message);
        scrapeOk = false;
      }
    } else {
      company = discover.company;
    }
  }

  const research = await runCompanyWebsiteResearch(companyId);
  if (!research.ok) {
    warnings.push(research.message);
    scrapeOk = false;
  } else {
    company = research.company;
  }

  return { companyScrapeOk: scrapeOk, warnings, company };
};

/**
 * Import or create a job from a listing URL; reuses an existing job row when URL matches.
 */
const resolveJobFromListingUrl = async (
  companyId: string,
  jobListingUrl: string,
): Promise<
  | { ok: true; job: Job; warnings: string[] }
  | { ok: false; error: string; job?: Job }
> => {
  const urlCheck = validatePublicJobListingUrl(jobListingUrl);
  if (!urlCheck.ok) {
    return { ok: false, error: urlCheck.error };
  }

  const supabase = requireCrmSupabaseClient();
  const existingJob = await findJobByUrlFromSupabase(supabase, urlCheck.href);
  const company = await getCompanyFromStore(companyId);
  const companyName = company?.name;

  if (existingJob) {
    const warnings: string[] = [];
    if (existingJob.companyId !== companyId) {
      warnings.push(
        "Reused an existing job with this posting URL (linked to a different company).",
      );
    }

    const importResult = await runJobListingImport({
      job: existingJob,
      sourceUrl: urlCheck.href,
      companyName,
    });

    if (!importResult.ok) {
      return {
        ok: false,
        error: importResult.error,
        job: existingJob,
      };
    }

    return { ok: true, job: importResult.job, warnings };
  }

  const created = await createJobFromListingUrlAndImport({
    companyId,
    urlRaw: urlCheck.href,
  });

  if (!created.ok) {
    return {
      ok: false,
      error: created.error,
      job: created.createdJob,
    };
  }

  return { ok: true, job: created.job, warnings: [] };
};

/**
 * Orchestrates company resolve/scrape, job scrape, and optional resume queue from two URLs.
 */
export const runQuickApplyPipeline = async (
  input: RunQuickApplyPipelineInput,
): Promise<RunQuickApplyPipelineOutcome> => {
  console.log("🚀 runQuickApplyPipeline");

  const companyWebsiteNormalized = normalizeCompanyWebsiteUrlInput(input.companyWebsiteUrl);
  const companyUrlCheck = validatePublicJobListingUrl(
    companyWebsiteNormalized || normalizeListingUrlInput(input.companyWebsiteUrl),
  );
  if (!companyUrlCheck.ok) {
    return { ok: false, statusCode: 400, error: `Company website: ${companyUrlCheck.error}` };
  }

  const jobListingNormalized = normalizeListingUrlInput(input.jobListingUrl);
  const jobUrlCheck = validatePublicJobListingUrl(jobListingNormalized);
  if (!jobUrlCheck.ok) {
    return { ok: false, statusCode: 400, error: `Job listing: ${jobUrlCheck.error}` };
  }

  const supabase = requireCrmSupabaseClient();
  const warnings: string[] = [];
  let companyCreated = false;

  let company =
    (await findCompanyByWebsiteFromSupabase(supabase, companyUrlCheck.href)) ?? null;

  if (!company) {
    const derivedName = deriveCompanyNameFromWebsiteUrl(companyUrlCheck.href);
    company = await createCompanyInStore({
      name: derivedName,
      website: companyUrlCheck.href,
      notes: "Created from quick apply",
    });
    companyCreated = true;
  } else if (!company.website.trim()) {
    const updated = await updateCompanyInStore(company.id, { website: companyUrlCheck.href });
    if (updated) {
      company = updated;
    }
  }

  const companyId = company.id;

  const [companyScrapeOutcome, jobOutcome] = await Promise.all([
    runCompanyScrapePipeline(companyId),
    resolveJobFromListingUrl(companyId, jobUrlCheck.href),
  ]);

  warnings.push(...companyScrapeOutcome.warnings);

  if (!jobOutcome.ok) {
    const partial: QuickApplyResult = {
      companyId,
      jobId: jobOutcome.job?.id ?? "",
      companyCreated,
      companyScrapeOk: companyScrapeOutcome.companyScrapeOk,
      jobScrapeOk: false,
      resumeQueued: false,
      warnings,
      company: companyScrapeOutcome.company ?? company,
      job: jobOutcome.job,
    };
    return {
      ok: false,
      statusCode: 422,
      error: jobOutcome.error,
      data: partial,
    };
  }

  warnings.push(...jobOutcome.warnings);

  const job = jobOutcome.job;
  let resumeQueued = false;
  let resumeSkipReason: string | undefined;

  try {
    const context = await loadJobGenerationContext(supabase, job.id);
    assertHasActiveSkills(context);
    assertHasCandidateName(context);
    queueResumeGenerationInBackground(supabase, context);
    resumeQueued = true;
  } catch (error: unknown) {
    if (error instanceof JobGenerationContextError) {
      resumeSkipReason = error.message;
    } else {
      const msg = error instanceof Error ? error.message : "Resume generation could not be queued";
      resumeSkipReason = msg;
      warnings.push(msg);
    }
  }

  const result: QuickApplyResult = {
    companyId,
    jobId: job.id,
    companyCreated,
    companyScrapeOk: companyScrapeOutcome.companyScrapeOk,
    jobScrapeOk: true,
    resumeQueued,
    resumeSkipReason,
    warnings,
    company: companyScrapeOutcome.company ?? company,
    job,
  };

  console.log("✅ runQuickApplyPipeline complete", {
    companyId,
    jobId: job.id,
    resumeQueued,
  });

  return { ok: true, data: result };
};
