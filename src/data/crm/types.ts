export type Company = {
  id: string;
  name: string;
  website: string;
  notes: string;
  /** Same-domain URLs found from one-shot homepage link harvest (stored in `companies.json`). */
  websiteUrls: string[];
  /** When true, discovery cannot be run again (matches lead “one run” UX). */
  playwrightWebsiteUrlDiscoveryAttempted: boolean;
  /** AI (or plain-text) summary from website research crawl. */
  websiteResearchSummary: string;
  /** ISO timestamp of last successful website research. */
  websiteResearchCompletedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type Employee = {
  id: string;
  companyId: string;
  name: string;
  role: string;
  email: string;
  linkedinUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type JobStatus = "draft" | "applied" | "closed" | "archived";

export type JobType = "job" | "contract";

export type Job = {
  id: string;
  companyId: string;
  /** Distinguishes a traditional job posting from a contract engagement. Defaults to "job". */
  type: JobType;
  title: string;
  url: string;
  status: JobStatus;
  /** Latest successful listing plain text (denormalized for UI). */
  description: string;
  /** ISO timestamp of last successful import-listing completion. */
  listingImportedAt: string;
  /** Points to `job-listing-scrape-runs.json`; empty if none. */
  latestScrapeRunId: string;
  /** Points to `job-listing-ai-exchanges.json`; empty if no AI step yet. */
  latestAiExchangeId: string;
  /** AI-extracted bullet list from the job posting. */
  responsibilities: string[];
  /** AI-extracted required qualifications from the job posting. */
  requirements: string[];
  /** AI-extracted preferred / nice-to-have skills from the job posting. */
  niceToHaves: string[];
  createdAt: string;
  updatedAt: string;
};

export type JobApplication = {
  id: string;
  jobId: string;
  submittedAt: string;
  imageGraphicId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

/** Graphics Studio layout row (Supabase `image_graphics`; API type only). */
export type ImageGraphic = {
  id: string;
  title: string;
  canvasWidthPx: number;
  canvasHeightPx: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

/** Links a CRM company + job with tenure dates (resume work history). */
export type Employment = {
  id: string;
  companyId: string;
  jobId: string;
  /** ISO date string (YYYY-MM-DD). */
  startDate: string;
  /** ISO date string; empty means current role. */
  endDate: string;
  createdAt: string;
  updatedAt: string;
};
