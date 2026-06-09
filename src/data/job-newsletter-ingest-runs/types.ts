export type JobNewsletterIngestRunStatus = 'running' | 'completed' | 'failed';

export type JobNewsletterIngestRun = {
  id: string;
  source_id: string;
  status: JobNewsletterIngestRunStatus;
  emails_processed: number;
  listings_found: number;
  jobs_created: number;
  jobs_skipped: number;
  companies_created: number;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
};

export type CreateJobNewsletterIngestRunInput = {
  source_id: string;
  status?: JobNewsletterIngestRunStatus;
};

export type UpdateJobNewsletterIngestRunInput = {
  status?: JobNewsletterIngestRunStatus;
  emails_processed?: number;
  listings_found?: number;
  jobs_created?: number;
  jobs_skipped?: number;
  companies_created?: number;
  error_message?: string | null;
  completed_at?: string | null;
};
