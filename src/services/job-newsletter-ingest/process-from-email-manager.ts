import { requireCrmSupabaseClient } from '../../data/crm/require-crm-supabase-client';
import {
  createJobNewsletterIngestRun,
  updateJobNewsletterIngestRun,
} from '../../data/job-newsletter-ingest-runs';
import { getJobNewsletterSourceBySenderEmail } from '../../data/job-newsletter-sources';
import {
  listFetchedEmailsFromEmailManager,
  markFetchedEmailsProcessedInEmailManager,
  runEmailSyncTasksFromEmailManager,
} from '../email-manager';
import { mapEmailManagerFetchedEmailToInbound } from './map-email-manager-fetched-email-to-inbound';
import { processJobNewsletterIngest } from './process-job-newsletter-ingest';
import type { JobNewsletterIngestResult } from './types';

export type ProcessJobNewslettersFromEmailManagerInput = {
  syncTaskId?: string;
  /** Newsletter source sender — runs matching email-manager Gmail sync task(s) first. */
  senderFilter?: string;
};

/**
 * Sync Gmail via email-manager, pull unprocessed emails, parse with AI, ingest CRM jobs.
 */
export const processJobNewslettersFromEmailManager = async (
  input: ProcessJobNewslettersFromEmailManagerInput = {},
): Promise<JobNewsletterIngestResult> => {
  console.log('🚀 processJobNewslettersFromEmailManager', input);

  let runId: string | undefined;

  const senderFilter = input.senderFilter?.trim();
  if (senderFilter) {
    const supabase = requireCrmSupabaseClient();
    const source = await getJobNewsletterSourceBySenderEmail(supabase, senderFilter);
    if (source) {
      const run = await createJobNewsletterIngestRun(supabase, { source_id: source.id });
      runId = run.id;
    }
  }

  const completeRun = async (
    patch: Parameters<typeof updateJobNewsletterIngestRun>[2],
  ): Promise<void> => {
    if (!runId) return;
    await updateJobNewsletterIngestRun(requireCrmSupabaseClient(), runId, {
      ...patch,
      completed_at: patch.completed_at ?? new Date().toISOString(),
    });
  };

  try {
    await runEmailSyncTasksFromEmailManager({
      syncTaskId: input.syncTaskId,
      senderFilter: input.senderFilter,
    });

    const fetched = await listFetchedEmailsFromEmailManager({
      syncTaskId: input.syncTaskId,
      unprocessedOnly: true,
    });

    if (fetched.length === 0) {
      console.log('✅ processJobNewslettersFromEmailManager — no unprocessed emails');
      await completeRun({
        status: 'completed',
        emails_processed: 0,
      });
      return {
        emailsProcessed: 0,
        listingsFound: 0,
        jobsCreated: 0,
        jobsSkipped: 0,
        companiesCreated: 0,
        emailResults: [],
      };
    }

    const emails = fetched.map(mapEmailManagerFetchedEmailToInbound);
    const result = await processJobNewsletterIngest({ emails, runId });

    const processedIds = fetched
      .filter((_row, index) => result.emailResults[index]?.status === 'processed')
      .map((row) => row.id);

    if (processedIds.length > 0) {
      await markFetchedEmailsProcessedInEmailManager(processedIds);
    }

    await completeRun({
      status: 'completed',
      emails_processed: result.emailsProcessed,
      listings_found: result.listingsFound,
      jobs_created: result.jobsCreated,
      jobs_skipped: result.jobsSkipped,
      companies_created: result.companiesCreated,
    });

    console.log('✅ processJobNewslettersFromEmailManager complete', {
      fetched: fetched.length,
      jobsCreated: result.jobsCreated,
    });

    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Ingest failed';
    console.error('❌ processJobNewslettersFromEmailManager:', message);
    await completeRun({
      status: 'failed',
      error_message: message,
    });
    throw err;
  }
};
